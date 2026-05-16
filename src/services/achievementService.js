const { prisma } = require('../config/database');

const ACHIEVEMENTS = [
  // Starter achievements
  { code: 'FIRST_HEIST', name: 'First Steps', description: 'Complete your first heist', icon: '🦅', category: 'starter', requirement: 1 },
  { code: 'PERFECT_RUN', name: 'Perfect Heist', description: 'Complete a heist without picking any decoys', icon: '💎', category: 'skill', requirement: 1 },
  { code: 'SPEED_DEMON', name: 'Speed Demon', description: 'Complete a heist in under half the time limit', icon: '⚡', category: 'skill', requirement: 1 },

  // Score achievements
  { code: 'SCORE_1000', name: 'Rising Star', description: 'Reach 1,000 total score', icon: '⭐', category: 'score', requirement: 1000 },
  { code: 'SCORE_10000', name: 'Master Thief', description: 'Reach 10,000 total score', icon: '🌟', category: 'score', requirement: 10000 },
  { code: 'SCORE_50000', name: 'Legendary Crows', description: 'Reach 50,000 total score', icon: '💫', category: 'score', requirement: 50000 },

  // Level achievements
  { code: 'LEVEL_5', name: 'Getting Started', description: 'Complete 5 levels', icon: '🥉', category: 'progress', requirement: 5 },
  { code: 'LEVEL_10', name: 'Pro Heister', description: 'Complete 10 levels', icon: '🥈', category: 'progress', requirement: 10 },
  { code: 'LEVEL_20', name: 'Master Planner', description: 'Complete 20 levels', icon: '🥇', category: 'progress', requirement: 20 },

  // Daily heist achievements
  { code: 'DAILY_STREAK_3', name: 'Consistent Crow', description: 'Complete 3 daily heists in a row', icon: '🔥', category: 'daily', requirement: 3 },
  { code: 'DAILY_STREAK_7', name: 'Dedicated Heister', description: 'Complete 7 daily heists in a row', icon: '🔥', category: 'daily', requirement: 7 },
  { code: 'DAILY_STREAK_30', name: 'Unstoppable', description: 'Complete 30 daily heists in a row', icon: '👑', category: 'daily', requirement: 30 },

  // Decoy achievements
  { code: 'DECOY_HUNTER', name: 'Decoy Hunter', description: 'Identify and avoid 10 decoys', icon: '🔍', category: 'skill', requirement: 10 },
  { code: 'DECOY_MASTER', name: 'Decoy Master', description: 'Avoid 50 decoys total', icon: '🎯', category: 'skill', requirement: 50 },

  // No-overflow achievements
  { code: 'EXACT_PACKER', name: 'Exact Packer', description: 'Complete a heist with exactly maximum weight capacity', icon: '📦', category: 'skill', requirement: 1 },
  { code: 'OPTIMAL_PATH', name: 'Optimal Path', description: 'Get the highest possible score on any level', icon: '🗺️', category: 'skill', requirement: 1 },
];

async function seedAchievements() {
  for (const achievement of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: {},
      create: achievement
    });
  }
}

async function checkAndAwardAchievements(playerId, heistResult = null, context = {}) {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      player_achievements: { include: { achievement: true } }
    }
  });

  if (!player) return [];

  const earnedCodes = new Set(player.player_achievements.map(pa => pa.achievement.code));
  const achievements = await prisma.achievement.findMany();
  const newlyEarned = [];

  for (const achievement of achievements) {
    if (earnedCodes.has(achievement.code)) continue;

    let earned = false;

    switch (achievement.code) {
      case 'FIRST_HEIST':
        earned = player.total_score >= 0;
        break;

      case 'PERFECT_RUN':
        earned = heistResult && heistResult.decoyCount === 0 && heistResult.score > 0;
        break;

      case 'SPEED_DEMON':
        earned = heistResult && heistResult.timeBonusMultiplier === 1.5;
        break;

      case 'SCORE_1000':
      case 'SCORE_10000':
      case 'SCORE_50000':
        earned = player.total_score >= achievement.requirement;
        break;

      case 'LEVEL_5':
      case 'LEVEL_10':
      case 'LEVEL_20':
        earned = (player.completed_levels?.length || 0) >= achievement.requirement;
        break;

      case 'DAILY_STREAK_3':
      case 'DAILY_STREAK_7':
      case 'DAILY_STREAK_30':
        earned = (player.daily_streak || 0) >= achievement.requirement;
        break;

      case 'DECOY_HUNTER':
      case 'DECOY_MASTER':
        const decoyAvoided = context.decoys_avoided || 0;
        const totalDecoysAvoided = (player.decoys_avoided || 0) + decoyAvoided;
        if (decoyAvoided > 0) {
          await prisma.player.update({
            where: { id: playerId },
            data: { decoys_avoided: totalDecoysAvoided }
          });
        }
        earned = totalDecoysAvoided >= achievement.requirement;
        break;

      case 'EXACT_PACKER':
        earned = heistResult && heistResult.totalWeight === context.carry_limit && heistResult.score > 0;
        break;

      case 'OPTIMAL_PATH':
        earned = heistResult && context.is_optimal === true;
        break;
    }

    if (earned) {
      await prisma.playerAchievement.create({
        data: {
          player_id: playerId,
          achievement_id: achievement.id
        }
      });
      newlyEarned.push(achievement);
    }
  }

  return newlyEarned;
}

async function getPlayerAchievements(playerId) {
  return prisma.playerAchievement.findMany({
    where: { player_id: playerId },
    include: { achievement: true },
    orderBy: { unlocked_at: 'desc' }
  });
}

async function getAllAchievements() {
  return prisma.achievement.findMany({
    orderBy: [{ category: 'asc' }, { requirement: 'asc' }]
  });
}

module.exports = {
  seedAchievements,
  checkAndAwardAchievements,
  getPlayerAchievements,
  getAllAchievements,
  ACHIEVEMENTS
};