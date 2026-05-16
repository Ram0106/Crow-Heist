const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function connectDatabase() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  try {
    await prisma.$connect();
    console.log('PostgreSQL connected via Prisma');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

module.exports = {
  prisma,
  connectDatabase
};
