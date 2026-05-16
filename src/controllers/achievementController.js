const {
  checkAndAwardAchievements,
  getPlayerAchievements,
  getAllAchievements,
  seedAchievements
} = require('../services/achievementService');
const { processHeistSubmission } = require('./heistController');
const { getPlayerAndLevel } = require('./heistController');

// Reuse getPlayerAndLevel from heistController
const heistController = require('./heistController');

async function getAchievements(req, res, next) {
  try {
    const allAchievements = await getAllAchievements();
    return res.json({
      success: true,
      data: { achievements: allAchievements },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

async function getPlayerAchievementsHandler(req, res, next) {
  try {
    const { playerId } = req.params;
    const achievements = await getPlayerAchievements(playerId);

    return res.json({
      success: true,
      data: { achievements },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

async function unlockAchievement(req, res, next) {
  try {
    const { player_id, achievement_code } = req.body;
    const { prisma } = require('../config/database');

    const achievement = await prisma.achievement.findUnique({
      where: { code: achievement_code }
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        data: {},
        error: 'Achievement not found'
      });
    }

    const existing = await prisma.playerAchievement.findUnique({
      where: {
        player_id_achievement_id: {
          player_id,
          achievement_id: achievement.id
        }
      }
    });

    if (existing) {
      return res.json({
        success: true,
        data: { achievement, already_unlocked: true },
        error: null
      });
    }

    const playerAchievement = await prisma.playerAchievement.create({
      data: {
        player_id,
        achievement_id: achievement.id
      },
      include: { achievement: true }
    });

    return res.json({
      success: true,
      data: { achievement: playerAchievement.achievement, newly_unlocked: true },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAchievements,
  getPlayerAchievementsHandler,
  unlockAchievement
};