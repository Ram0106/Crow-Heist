const { prisma } = require('../config/database');

async function registerPlayer(req, res, next) {
  try {
    const username = String(req.body.username || '').trim();

    if (username.length < 3 || username.length > 24) {
      return res.status(400).json({
        success: false,
        data: {},
        error: 'username must be between 3 and 24 characters'
      });
    }

    const existing = await prisma.player.findUnique({
      where: { username }
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        data: {},
        error: 'username is already taken'
      });
    }

    const player = await prisma.player.create({
      data: { username }
    });

    // Map Prisma field names to frontend expectations
    const playerResponse = {
      _id: player.id,
      id: player.id,
      username: player.username,
      total_score: player.total_score,
      current_level: player.current_level,
      unlocked_levels: player.completed_levels.length > 0 ? player.completed_levels : [1],
      completed_levels: player.completed_levels,
      nest_items: [],
      daily_streak: 0
    };

    return res.status(201).json({
      success: true,
      data: { player: playerResponse },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

async function getPlayer(req, res, next) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: req.params.id }
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        data: {},
        error: 'Player not found'
      });
    }

    // Map Prisma field names to frontend expectations
    const playerResponse = {
      _id: player.id,
      id: player.id,
      username: player.username,
      total_score: player.total_score,
      current_level: player.current_level,
      unlocked_levels: player.completed_levels.length > 0 ? player.completed_levels : [1],
      completed_levels: player.completed_levels,
      nest_items: [],
      daily_streak: 0
    };

    return res.json({
      success: true,
      data: { player: playerResponse },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerPlayer,
  getPlayer
};
