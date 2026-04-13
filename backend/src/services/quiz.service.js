import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/appError.js";
import {
  isAnswerCorrect,
  normalizeAnswer,
  pointsForTry,
} from "../lib/quizRules.js";

/**
 * @param {import("@prisma/client").QuizRound & { submissions: import("@prisma/client").RoundSubmission[] }} round
 */
function isRoundResolved(round) {
  if (round.gaveUp || round.isCorrect) return true;
  const guesses = round.submissions.filter((s) => !s.isGivenUp);
  if (guesses.length >= 3 && guesses.every((g) => !g.isCorrect)) {
    return true;
  }
  return false;
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * @param {import("@prisma/client").QuizRound & { submissions: import("@prisma/client").RoundSubmission[] }} round
 */
function wrongGuessCount(round) {
  return round.submissions.filter((s) => !s.isGivenUp && !s.isCorrect).length;
}

async function assertRunOwned(runId, userId) {
  const run = await prisma.quizRun.findFirst({
    where: { id: runId, userId },
  });
  if (!run) {
    throw new AppError(404, "Quiz run not found");
  }
  return run;
}

async function loadRoundForUser(runId, roundOrder, userId) {
  await assertRunOwned(runId, userId);
  const round = await prisma.quizRound.findFirst({
    where: { quizRunId: runId, roundOrder },
    include: {
      submissions: { orderBy: { tryNumber: "asc" } },
      city: true,
      quizRun: true,
    },
  });
  if (!round) {
    throw new AppError(404, "Round not found");
  }
  if (round.quizRun.userId !== userId) {
    throw new AppError(404, "Round not found");
  }
  return round;
}

async function maybeCompleteRun(quizRunId) {
  const rounds = await prisma.quizRound.findMany({
    where: { quizRunId },
    include: { submissions: true },
  });
  const allDone = rounds.every((r) => isRoundResolved(r));
  if (allDone) {
    await prisma.quizRun.update({
      where: { id: quizRunId },
      data: { endedAt: new Date() },
    });
  }
}

/**
 * @param {string} userId
 * @param {import("@prisma/client").ContinentType} continent
 */
export async function startQuizRun(userId, continent) {
  const whereClause = continent === "ALL"
    ? { isActive: true }
    : { continent, isActive: true };
  const pool = await prisma.city.findMany({
    where: whereClause,
    select: { id: true },
  });
  if (pool.length < 5) {
    throw new AppError(
      400,
      `Not enough active cities for this continent (${pool.length}/5 required). Seed more cities.`,
      "INSUFFICIENT_CITIES"
    );
  }
  shuffleInPlace(pool);
  const picked = pool.slice(0, 5);

  const run = await prisma.$transaction(async (tx) => {
    const quizRun = await tx.quizRun.create({
      data: {
        userId,
        continent,
        numRounds: 5,
      },
    });
    for (let i = 0; i < 5; i++) {
      await tx.quizRound.create({
        data: {
          quizRunId: quizRun.id,
          cityId: picked[i].id,
          roundOrder: i + 1,
        },
      });
    }
    return quizRun;
  });

  return {
    runId: run.id,
    continent: run.continent,
    numRounds: run.numRounds,
    currentRoundOrder: 1,
  };
}

/**
 * @param {string} runId
 * @param {string} userId
 */
export async function getQuizRunDetail(runId, userId) {
  const run = await prisma.quizRun.findFirst({
    where: { id: runId, userId },
    include: {
      rounds: {
        orderBy: { roundOrder: "asc" },
        include: { submissions: true },
      },
    },
  });
  if (!run) {
    throw new AppError(404, "Quiz run not found");
  }

  const roundsPayload = run.rounds.map((r) => ({
    roundOrder: r.roundOrder,
    resolved: isRoundResolved(r),
    pointsEarned: r.pointsEarned,
    isCorrect: r.isCorrect,
    gaveUp: r.gaveUp,
  }));

  let currentRoundOrder = null;
  for (const r of run.rounds) {
    if (!isRoundResolved(r)) {
      currentRoundOrder = r.roundOrder;
      break;
    }
  }

  return {
    id: run.id,
    continent: run.continent,
    scoreTotal: run.scoreTotal,
    numRounds: run.numRounds,
    startedAt: run.startedAt,
    endedAt: run.endedAt,
    currentRoundOrder,
    rounds: roundsPayload,
  };
}

/**
 * @param {string} runId
 * @param {number} roundOrder
 * @param {string} userId
 */
export async function getRoundState(runId, roundOrder, userId) {
  const round = await loadRoundForUser(runId, roundOrder, userId);
  const resolved = isRoundResolved(round);
  const wrong = wrongGuessCount(round);
  const triesUsed = round.submissions.filter((s) => !s.isGivenUp).length;

  return {
    runId,
    roundOrder,
    resolved,
    triesUsed,
    maxTries: 3,
    canSubmit: !resolved && triesUsed < 3,
    canGiveUp: !resolved && !round.gaveUp,
    pointsEarned: round.pointsEarned,
    hint1: !resolved && wrong >= 1 ? round.city.hint1 : null,
    hint2: !resolved && wrong >= 2 ? round.city.hint2 : null,
  };
}

/**
 * @param {string} runId
 * @param {number} roundOrder
 * @param {string} userId
 */
export async function getRoundImageBuffer(runId, roundOrder, userId) {
  const round = await loadRoundForUser(runId, roundOrder, userId);
  const buf = round.city.satelliteImageData;
  const mime = round.city.satelliteImageMimeType || "application/octet-stream";
  if (!buf || buf.length === 0) {
    throw new AppError(404, "No image for this round");
  }
  return { buffer: Buffer.from(buf), mime };
}

/**
 * @param {string} runId
 * @param {number} roundOrder
 * @param {string} userId
 * @param {string} answerRaw
 */
export async function submitAnswer(runId, roundOrder, userId, answerRaw) {
  const round = await loadRoundForUser(runId, roundOrder, userId);

  if (round.quizRun.endedAt) {
    throw new AppError(400, "This quiz run is already finished");
  }
  if (isRoundResolved(round)) {
    throw new AppError(400, "Round is already resolved");
  }

  const subs = round.submissions;
  if (subs.length >= 3) {
    throw new AppError(400, "No tries remaining");
  }

  const tryNumber = subs.length + 1;
  const city = round.city;
  const normalized = normalizeAnswer(answerRaw);
  const correct = isAnswerCorrect(
    answerRaw,
    city.normalizedAnswer,
    city.name
  );

  let points = 0;
  if (correct) {
    points = pointsForTry(tryNumber);
    await prisma.$transaction(async (tx) => {
      await tx.roundSubmission.create({
        data: {
          roundId: round.id,
          tryNumber,
          typedAnswerRaw: answerRaw,
          typedAnswerNormalized: normalized,
          isCorrect: true,
          isGivenUp: false,
        },
      });
      await tx.quizRound.update({
        where: { id: round.id },
        data: {
          isCorrect: true,
          resolvedTryNumber: tryNumber,
          pointsEarned: points,
        },
      });
      await tx.quizRun.update({
        where: { id: round.quizRunId },
        data: { scoreTotal: { increment: points } },
      });
    });
  } else if (tryNumber === 3) {
    await prisma.$transaction(async (tx) => {
      await tx.roundSubmission.create({
        data: {
          roundId: round.id,
          tryNumber,
          typedAnswerRaw: answerRaw,
          typedAnswerNormalized: normalized,
          isCorrect: false,
          isGivenUp: false,
        },
      });
      await tx.quizRound.update({
        where: { id: round.id },
        data: {
          resolvedTryNumber: 3,
          pointsEarned: 0,
          isCorrect: false,
        },
      });
    });
  } else {
    await prisma.roundSubmission.create({
      data: {
        roundId: round.id,
        tryNumber,
        typedAnswerRaw: answerRaw,
        typedAnswerNormalized: normalized,
        isCorrect: false,
        isGivenUp: false,
      },
    });
  }

  const after = await prisma.quizRound.findFirst({
    where: { id: round.id },
    include: {
      submissions: { orderBy: { tryNumber: "asc" } },
      city: true,
      quizRun: true,
    },
  });

  const wrong = wrongGuessCount(after);
  await maybeCompleteRun(after.quizRunId);
  const runAfter = await prisma.quizRun.findUnique({
    where: { id: after.quizRunId },
  });

  return {
    correct,
    tryNumber,
    pointsAwarded: correct ? points : 0,
    runScoreTotal: runAfter.scoreTotal,
    hint1: !correct && wrong >= 1 ? after.city.hint1 : null,
    hint2: !correct && wrong >= 2 ? after.city.hint2 : null,
    roundComplete: isRoundResolved(after),
    runComplete: !!runAfter.endedAt,
    endedAt: runAfter.endedAt,
    cityName: isRoundResolved(after) ? after.city.name : null,
  };
}

/**
 * @param {string} runId
 * @param {number} roundOrder
 * @param {string} userId
 */
export async function giveUpRound(runId, roundOrder, userId) {
  const round = await loadRoundForUser(runId, roundOrder, userId);

  if (round.quizRun.endedAt) {
    throw new AppError(400, "This quiz run is already finished");
  }
  if (isRoundResolved(round)) {
    throw new AppError(400, "Round is already resolved");
  }

  const subs = round.submissions;
  if (subs.length >= 3) {
    throw new AppError(400, "No tries remaining");
  }

  const tryNumber = subs.length + 1;

  await prisma.$transaction(async (tx) => {
    await tx.roundSubmission.create({
      data: {
        roundId: round.id,
        tryNumber,
        typedAnswerRaw: null,
        typedAnswerNormalized: null,
        isCorrect: false,
        isGivenUp: true,
      },
    });
    await tx.quizRound.update({
      where: { id: round.id },
      data: {
        gaveUp: true,
        resolvedTryNumber: tryNumber,
        pointsEarned: 0,
      },
    });
  });

  await maybeCompleteRun(round.quizRunId);
  const runAfter = await prisma.quizRun.findUnique({
    where: { id: round.quizRunId },
  });

  return {
    gaveUp: true,
    tryNumber,
    pointsAwarded: 0,
    runScoreTotal: runAfter.scoreTotal,
    roundComplete: true,
    runComplete: !!runAfter.endedAt,
    endedAt: runAfter.endedAt,
    cityName: round.city.name,
  };
}
