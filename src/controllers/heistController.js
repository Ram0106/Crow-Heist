const { prisma } = require('../config/database');
const { calculateHeistScore, calculateStars } = require('../utils/scoring');
const { checkAndAwardAchievements } = require('../services/achievementService');

function serializeLevel(level) {
  return {
    id: level.id,
    level_number: level.level_number,
    location_name: level.location_name,
    carry_limit: level.weight_limit,
    time_limit_seconds: level.time_limit,
    objects: level.objects,
    patrol_speed: 1.0,
    difficulty_tier: level.difficulty
  };
}

async function getPlayerAndLevel(playerId, levelNumber) {
  const [player, level] = await Promise.all([
    prisma.player.findUnique({ where: { id: playerId } }),
    prisma.level.findUnique({
      where: { level_number: Number(levelNumber) },
      include: { objects: true }
    })
  ]);

  return { player, level };
}

function findSelectedObjects(level, selectedObjectIds) {
  const selectedIdSet = new Set(selectedObjectIds.map(String));
  return level.objects
    .filter((object) => selectedIdSet.has(String(object.id)))
    .map((object) => ({
      name: object.name,
      value: object.value,
      weight: object.weight,
      is_decoy: object.is_decoy
    }));
}

function determineRarity(value) {
  if (value >= 100) return 'legendary';
  if (value >= 50) return 'rare';
  if (value >= 20) return 'uncommon';
  return 'common';
}

async function applySuccessfulHeistRewards({ player, level, selectedObjects, score }) {
  const nextLevel = level.level_number + 1;
  const newCompletedLevels = [...(player.completed_levels || [])];

  if (!newCompletedLevels.includes(level.level_number)) {
    newCompletedLevels.push(level.level_number);
  }

  const updatedPlayer = await prisma.player.update({
    where: { id: player.id },
    data: {
      total_score: player.total_score + score,
      current_level: Math.max(player.current_level || 1, nextLevel),
      completed_levels: newCompletedLevels
    }
  });

  // Record collected items with rarity
  for (const obj of selectedObjects) {
    if (obj.is_decoy) continue;
    const rarity = determineRarity(obj.value);
    const existing = await prisma.collectedItem.findUnique({
      where: {
        player_id_item_name: {
          player_id: player.id,
          item_name: obj.name
        }
      }
    });

    if (existing) {
      await prisma.collectedItem.update({
        where: { id: existing.id },
        data: {
          total_value: existing.total_value + obj.value,
          times_collected: existing.times_collected + 1,
          last_collected: new Date()
        }
      });
    } else {
      await prisma.collectedItem.create({
        data: {
          player_id: player.id,
          item_name: obj.name,
          rarity,
          total_value: obj.value,
          times_collected: 1
        }
      });
    }
  }

  return updatedPlayer;
}

async function startHeist(req, res, next) {
  try {
    const { player, level } = await getPlayerAndLevel(req.body.player_id, req.body.level_number);

    if (!player) {
      return res.status(404).json({ success: false, data: {}, error: 'Player not found' });
    }

    if (!level) {
      return res.status(404).json({ success: false, data: {}, error: 'Level not found' });
    }

    const completedLevels = player.completed_levels || [];
    const previousLevel = level.level_number - 1;
    
    // Level 1 is always accessible, other levels require previous level to be completed
    if (level.level_number > 1 && !completedLevels.includes(previousLevel)) {
      return res.status(403).json({
        success: false,
        data: {},
        error: 'Level is locked'
      });
    }

    return res.json({
      success: true,
      data: { level: serializeLevel(level) },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

async function submitHeist(req, res, next) {
  try {
    const result = await processHeistSubmission({
      playerId: req.body.player_id,
      levelNumber: req.body.level_number,
      selectedObjectIds: req.body.selected_object_ids,
      timeTakenSeconds: Number(req.body.time_taken_seconds),
      enforceUnlock: true
    });

    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    next(error);
  }
}

async function processHeistSubmission({
  playerId,
  levelNumber,
  selectedObjectIds,
  timeTakenSeconds,
  enforceUnlock = true
}) {
  const { player, level } = await getPlayerAndLevel(playerId, levelNumber);

  if (!player) {
    return {
      statusCode: 404,
      body: { success: false, data: {}, error: 'Player not found' }
    };
  }

  if (!level) {
    return {
      statusCode: 404,
      body: { success: false, data: {}, error: 'Level not found' }
    };
  }

  const completedLevels = player.completed_levels || [];
  const previousLevel = levelNumber - 1;
  
  // Level 1 is always accessible, other levels require previous level to be completed
  if (enforceUnlock && levelNumber > 1 && !completedLevels.includes(previousLevel)) {
    return {
      statusCode: 403,
      body: { success: false, data: {}, error: 'Level is locked' }
    };
  }

  const selectedObjects = findSelectedObjects(level, selectedObjectIds);

  if (selectedObjects.length !== selectedObjectIds.length) {
    return {
      statusCode: 400,
      body: {
        success: false,
        data: {},
        error: 'One or more selected_object_ids do not exist on this level'
      }
    };
  }

  const scoreBreakdown = calculateHeistScore({
    selectedObjects,
    carryLimit: level.weight_limit,
    timeTakenSeconds,
    timeLimitSeconds: level.time_limit
  });

  const heistResult = await prisma.heistResult.create({
    data: {
      player_id: player.id,
      level_number: level.level_number,
      total_value: scoreBreakdown.totalValue,
      total_weight: scoreBreakdown.totalWeight,
      score: scoreBreakdown.score,
      completed: scoreBreakdown.success,
      selected_objects: {
        create: selectedObjects
      }
    }
  });

  if (scoreBreakdown.success) {
    await applySuccessfulHeistRewards({
      player,
      level,
      selectedObjects,
      score: scoreBreakdown.score
    });

    // Calculate stars based on score thresholds
    const stars = calculateStars(
      scoreBreakdown.score,
      level.one_star_min || 0,
      level.two_star_min || 0,
      level.three_star_min || 0
    );

    // Save or update level result with stars
    const existingResult = await prisma.levelResult.findUnique({
      where: {
        player_id_level_number: {
          player_id: player.id,
          level_number: level.level_number
        }
      }
    });

    if (existingResult) {
      if (stars > existingResult.stars || scoreBreakdown.score > existingResult.best_score) {
        await prisma.levelResult.update({
          where: { id: existingResult.id },
          data: {
            stars: Math.max(existingResult.stars, stars),
            best_score: Math.max(existingResult.best_score, scoreBreakdown.score)
          }
        });
      }
    } else {
      await prisma.levelResult.create({
        data: {
          player_id: player.id,
          level_number: level.level_number,
          stars,
          best_score: scoreBreakdown.score
        }
      });
    }

    // Check and award achievements
    const newlyEarned = await checkAndAwardAchievements(player.id, scoreBreakdown, {
      carry_limit: level.weight_limit,
      decoys_avoided: level.objects.length - selectedObjects.filter(o => o.is_decoy).length,
      total_decoys: level.objects.filter(o => o.is_decoy).length
    });

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          heist_result: heistResult,
          score_breakdown: { ...scoreBreakdown, stars },
          completed_levels: player.completed_levels,
          new_achievements: newlyEarned
        },
        error: null
      }
    };
  } else {
    await prisma.player.update({
      where: { id: player.id },
      data: { updated_at: new Date() }
    });
  }

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        heist_result: heistResult,
        score_breakdown: scoreBreakdown,
        completed_levels: player.completed_levels
      },
      error: null
    }
  };
}

module.exports = {
  startHeist,
  submitHeist,
  processHeistSubmission,
  serializeLevel
};
