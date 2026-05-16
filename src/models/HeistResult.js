const { prisma } = require('../config/database');

const HeistResult = {
  async create(data) {
    return prisma.heistResult.create({
      data: {
        player_id: data.player_id,
        level_number: data.level_number,
        total_value: data.total_value,
        total_weight: data.total_weight,
        score: data.score,
        completed: data.success !== false,
        selected_objects: {
          create: data.selected_objects || []
        }
      },
      include: { selected_objects: true }
    });
  },

  async findById(id) {
    return prisma.heistResult.findUnique({
      where: { id },
      include: { selected_objects: true }
    });
  },

  async find(query = {}, options = {}) {
    const skip = options.skip || 0;
    const limit = options.limit || 50;
    const where = {};

    if (query.player_id) {
      where.player_id = query.player_id;
    }

    return prisma.heistResult.findMany({
      where,
      skip,
      take: limit,
      include: { selected_objects: true },
      orderBy: { timestamp: 'desc' }
    });
  },

  async findByPlayerIdAndLevelNumber(playerId, levelNumber) {
    return prisma.heistResult.findFirst({
      where: {
        player_id: playerId,
        level_number: levelNumber
      },
      include: { selected_objects: true }
    });
  },

  async countByPlayerIdAndLevelNumber(playerId, levelNumber) {
    return prisma.heistResult.count({
      where: {
        player_id: playerId,
        level_number: levelNumber
      }
    });
  }
};

module.exports = HeistResult;
