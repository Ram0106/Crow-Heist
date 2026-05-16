const { prisma } = require('../config/database');
const { serializeLevel } = require('./heistController');

async function getAvailableLevels(req, res, next) {
  try {
    const playerId = req.query.player_id;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        data: {},
        error: 'player_id query parameter is required'
      });
    }

    const player = await prisma.player.findUnique({
      where: { id: playerId }
    });
    if (!player) {
      return res.status(404).json({
        success: false,
        data: {},
        error: 'Player not found'
      });
    }

    // Get all levels, but only return the ones completed, plus the next available level
    const completedLevels = player.completed_levels || [];
    let availableLevelNumbers = [1]; // Always show level 1

    // Add any completed levels
    if (completedLevels.length > 0) {
      availableLevelNumbers = completedLevels;
      // Also show the next level to play (highest completed + 1)
      const nextLevel = Math.max(...completedLevels) + 1;
      availableLevelNumbers.push(nextLevel);
    }

    const levels = await prisma.level.findMany({
      where: {
        level_number: {
          in: availableLevelNumbers
        }
      },
      include: { objects: true },
      orderBy: { level_number: 'asc' }
    });

    return res.json({
      success: true,
      data: {
        levels: levels.map(serializeLevel)
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAvailableLevels
};
