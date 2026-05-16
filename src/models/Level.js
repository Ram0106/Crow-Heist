const { prisma } = require('../config/database');

const Level = {
  async create(data) {
    return prisma.level.create({
      data: {
        level_number: data.level_number,
        location_name: data.location_name,
        difficulty: data.difficulty_tier || 'medium',
        time_limit: data.time_limit_seconds,
        weight_limit: data.carry_limit,
        objects: {
          create: data.objects || []
        }
      },
      include: { objects: true }
    });
  },

  async findById(id) {
    return prisma.level.findUnique({
      where: { id },
      include: { objects: true }
    });
  },

  async findOne(query) {
    if (query.level_number) {
      return prisma.level.findUnique({
        where: { level_number: query.level_number },
        include: { objects: true }
      });
    }
    return null;
  },

  async find(query = {}, options = {}) {
    const skip = options.skip || 0;
    const limit = options.limit || 50;

    return prisma.level.findMany({
      skip,
      take: limit,
      include: { objects: true },
      orderBy: { level_number: 'asc' }
    });
  },

  async findByIdAndUpdate(id, data) {
    return prisma.level.update({
      where: { id },
      data: {
        location_name: data.location_name,
        difficulty: data.difficulty_tier,
        time_limit: data.time_limit_seconds,
        weight_limit: data.carry_limit
      },
      include: { objects: true }
    });
  }
};

module.exports = Level;
