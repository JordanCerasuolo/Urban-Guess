import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/appError.js";

/**
 * Profile + user-scoped quiz stats (no leaderboard).
 * @param {string} userId
 */
export async function getProfileWithStats(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const [agg, best] = await Promise.all([
    prisma.quizRun.aggregate({
      where: { userId, endedAt: { not: null } },
      _count: { _all: true },
      _max: { endedAt: true },
    }),
    prisma.quizRun.findFirst({
      where: { userId, endedAt: { not: null } },
      orderBy: { scoreTotal: "desc" },
      select: { scoreTotal: true },
    }),
  ]);

  const allRuns = await prisma.quizRun.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    select: { id: true, startedAt: true, endedAt: true, scoreTotal: true, continent: true },
  });

  return {
    user,
    stats: {
      completedRuns: agg._count._all,
      lastRunAt: agg._max.endedAt,
      bestScore: best?.scoreTotal ?? null,
      allRuns,
    },
  };
}
