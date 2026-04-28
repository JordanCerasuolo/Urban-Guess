import { prisma } from "../lib/prisma.js";

/**
 * Top completed quiz runs by score (global leaderboard).
 * @param {number} limit
 */
export async function getGlobalLeaderboard(limit = 50) {
  const grouped = await prisma.quizRun.groupBy({
    by: ['userId'],
    where: { endedAt: { not: null } },
    _sum: { scoreTotal: true },
    orderBy: { _sum: { scoreTotal: 'desc' } },
    take: limit,
  });

  const userIds = grouped.map(g => g.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true },
  });
  const userMap = Object.fromEntries(users.map(u => [u.id, u.username]));

  return grouped.map((g, i) => ({
    rank: i + 1,
    username: userMap[g.userId] || 'Unknown',
    score: g._sum.scoreTotal || 0,
  }));
}

/**
 * Monthly leaderboard — sums scores for quiz runs completed within a given
 * calendar month (year + month).
 * @param {number} year  e.g. 2026
 * @param {number} month 1-12
 * @param {number} limit
 */
export async function getMonthlyLeaderboard(year, month, limit = 50) {
  const start = new Date(year, month - 1, 1);          // first ms of month
  const end   = new Date(year, month, 1);              // first ms of next month

  const grouped = await prisma.quizRun.groupBy({
    by: ['userId'],
    where: {
      endedAt: { gte: start, lt: end },
    },
    _sum: { scoreTotal: true },
    orderBy: { _sum: { scoreTotal: 'desc' } },
    take: limit,
  });

  const userIds = grouped.map(g => g.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true },
  });
  const userMap = Object.fromEntries(users.map(u => [u.id, u.username]));

  return grouped.map((g, i) => ({
    rank: i + 1,
    username: userMap[g.userId] || 'Unknown',
    score: g._sum.scoreTotal || 0,
  }));
}