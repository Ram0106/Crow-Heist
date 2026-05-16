const { prisma } = require('../config/database');
const { todayKey } = require('../utils/dates');
const { processHeistSubmission, serializeLevel } = require('./heistController');

async function getOrCreateTodayDailyHeist() {
  const date = todayKey();
  let dailyHeist = await prisma.dailyHeist.findUnique({
    where: { date }
  });

  if (dailyHeist) {
    return dailyHeist;
  }

  const levelCount = await prisma.level.count();
  if (levelCount === 0) {
    throw new Error('No levels are available for daily heist');
  }

  const daySeed = date.split('-').reduce((sum, part) => sum + Number(part), 0);
  const levelNumber = (daySeed % levelCount) + 1;

  dailyHeist = await prisma.dailyHeist.create({
    data: {
      date,
      level_number: levelNumber
    }
  });

  return dailyHeist;
}

async function getDailyHeist(req, res, next) {
  try {
    const dailyHeist = await getOrCreateTodayDailyHeist();
    const level = await prisma.level.findUnique({
      where: { level_number: dailyHeist.level_number },
      include: { objects: true }
    });

    return res.json({
      success: true,
      data: {
        date: dailyHeist.date,
        level: serializeLevel(level)
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

async function submitDailyHeist(req, res, next) {
  try {
    const dailyHeist = await getOrCreateTodayDailyHeist();

    if (Number(req.body.level_number) !== dailyHeist.level_number) {
      return res.status(400).json({
        success: false,
        data: {},
        error: 'Submitted level_number does not match today daily heist'
      });
    }

    const result = await processHeistSubmission({
      playerId: req.body.player_id,
      levelNumber: req.body.level_number,
      selectedObjectIds: req.body.selected_object_ids,
      timeTakenSeconds: Number(req.body.time_taken_seconds),
      enforceUnlock: false
    });

    if (result.statusCode !== 200 || !result.body.data.score_breakdown.success) {
      return res.status(result.statusCode).json(result.body);
    }

    const playerId = req.body.player_id;
    const score = result.body.data.score_breakdown.score;

    // Check if player already has an entry for today's heist
    const existingEntry = await prisma.dailyHeistEntry.findFirst({
      where: {
        daily_heist_id: dailyHeist.id,
        player_id: playerId
      }
    });

    if (existingEntry) {
      // Update with higher score
      await prisma.dailyHeistEntry.update({
        where: { id: existingEntry.id },
        data: { score: Math.max(existingEntry.score, score) }
      });
    } else {
      // Create new entry
      await prisma.dailyHeistEntry.create({
        data: {
          daily_heist_id: dailyHeist.id,
          player_id: playerId,
          score
        }
      });
    }

    // Get current rank
    const entries = await prisma.dailyHeistEntry.findMany({
      where: { daily_heist_id: dailyHeist.id },
      orderBy: { score: 'desc' }
    });

    const dailyRank = entries.findIndex((entry) => entry.player_id === playerId) + 1;

    return res.json({
      success: true,
      data: {
        ...result.body.data,
        daily_rank: dailyRank
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDailyHeist,
  submitDailyHeist,
  getOrCreateTodayDailyHeist
};
