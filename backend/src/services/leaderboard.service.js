import { prisma } from "../lib/prisma.js";

/**
 * Top completed quiz runs by score (global leaderboard).
 * @param {number} limit
 */
export async function getGlobalLeaderboard(limit = 50) {
  const runs = await prisma.quizRun.findMany({
    where: { endedAt: { not: null } },
    orderBy: [{ scoreTotal: "desc" }, { endedAt: "desc" }],
    take: limit,
    select: {
      id: true,
      scoreTotal: true,
      continent: true,
      endedAt: true,
      user: { select: { username: true } },
    },
  });

  return runs.map((r, i) => ({
    rank: i + 1,
    username: r.user.username,
    score: r.scoreTotal,
    continent: r.continent,
    runId: r.id,
  }));
}
