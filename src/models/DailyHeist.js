const { prisma } = require('../config/database');

const DailyHeist = {
  async create(data) {
    return prisma.dailyHeist.create({
      data: {
        date: data.date,
        level_number: data.level_number,
        leaderboard: {
          create: data.leaderboard || []
        }
      },
      include: { leaderboard: true }
    });
  },

  async findOne(query) {
    if (query.date) {
      return prisma.dailyHeist.findUnique({
        where: { date: query.date },
        include: { leaderboard: true }
      });
    }
    return null;
  },

  async findOneAndUpdate(query, data) {
    if (query.date) {
      return prisma.dailyHeist.update({
        where: { date: query.date },
        data: {
          level_number: data.level_number
        },
        include: { leaderboard: true }
      });
    }
    return null;
  },

  async findOneAndUpsert(query, data) {
    if (query.date) {
      return prisma.dailyHeist.upsert({
        where: { date: query.date },
        update: {
          level_number: data.level_number
        },
        create: {
          date: query.date,
          level_number: data.level_number
        },
        include: { leaderboard: true }
      });
    }
    return null;
  }
};

module.exports = DailyHeist;
