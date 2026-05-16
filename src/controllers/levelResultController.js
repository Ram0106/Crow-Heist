const { prisma } = require('../config/database');

async function getPlayerLevelResults(req, res, next) {
  try {
    const { playerId } = req.params;

    const results = await prisma.levelResult.findMany({
      where: { player_id: playerId },
      orderBy: { level_number: 'asc' }
    });

    return res.json({
      success: true,
      data: { level_results: results },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPlayerLevelResults
};