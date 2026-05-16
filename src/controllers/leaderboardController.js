const { prisma } = require('../config/database');
const { todayKey } = require('../utils/dates');

async function getDailyLeaderboard(req, res, next) {
  try {
    const dailyHeist = await prisma.dailyHeist.findUnique({
      where: { date: todayKey() },
      include: {
        leaderboard: {
          include: { player: true },
          orderBy: { score: 'desc' },
          take: 20
        }
      }
    });

    const leaderboard = dailyHeist
      ? dailyHeist.leaderboard.map((entry, index) => ({
          rank: index + 1,
          player: {
            id: entry.player.id,
            username: entry.player.username,
            total_score: entry.player.total_score,
            current_level: entry.player.current_level
          },
          score: entry.score
        }))
      : [];

    return res.json({
      success: true,
      data: { leaderboard },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

async function getGlobalLeaderboard(req, res, next) {
  try {
    const players = await prisma.player.findMany({
      orderBy: { total_score: 'desc' },
      take: 20,
      select: {
        id: true,
        username: true,
        total_score: true,
        current_level: true
      }
    });

    return res.json({
      success: true,
      data: {
        leaderboard: players.map((player, index) => ({
          rank: index + 1,
          player
        }))
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDailyLeaderboard,
  getGlobalLeaderboard
};
