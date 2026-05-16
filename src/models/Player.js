const { prisma } = require('../config/database');

const Player = {
  async create(data) {
    return prisma.player.create({
      data: {
        username: data.username,
        total_score: data.total_score || 0,
        current_level: data.current_level || 1,
        completed_levels: data.completed_levels || []
      }
    });
  },

  async findById(id) {
    return prisma.player.findUnique({
      where: { id }
    });
  },

  async findOne(query) {
    if (query.username) {
      return prisma.player.findUnique({
        where: { username: query.username }
      });
    }
    return null;
  },

  async findByIdAndUpdate(id, data) {
    return prisma.player.update({
      where: { id },
      data: {
        total_score: data.total_score,
        current_level: data.current_level,
        completed_levels: data.completed_levels
      }
    });
  },

  async find(query = {}, options = {}) {
    const skip = options.skip || 0;
    const limit = options.limit || 50;

    return prisma.player.findMany({
      skip,
      take: limit,
      orderBy: { total_score: 'desc' }
    });
  },

  async countDocuments(query = {}) {
    return prisma.player.count();
  }
};

module.exports = Player;
