require('dotenv').config();

const { prisma } = require('../config/database');
const { connectDatabase } = require('../config/database');

const levels = [
  {
    level_number: 1,
    location_name: 'Kitchen Counter',
    carry_limit: 10,
    time_limit_seconds: 90,
    patrol_speed: 1.0,
    difficulty_tier: 'easy',
    objects: [
      { name: 'Silver Spoon', value: 30, weight: 1, is_decoy: false },
      { name: 'Bottle Cap', value: 8, weight: 1, is_decoy: false },
      { name: 'Shiny Key', value: 45, weight: 2, is_decoy: false },
      { name: 'Cookie Crumb', value: 12, weight: 1, is_decoy: false },
      { name: 'Gold Foil Wrapper', value: 38, weight: 2, is_decoy: false },
      { name: 'Tiny Bell', value: 55, weight: 3, is_decoy: false },
      { name: 'Cast Iron Pan', value: 150, weight: 12, is_decoy: true },
      { name: 'Marble Fruit Bowl', value: 180, weight: 13, is_decoy: true }
    ]
  },
  {
    level_number: 2,
    location_name: 'Museum Night Wing',
    carry_limit: 14,
    time_limit_seconds: 100,
    patrol_speed: 1.3,
    difficulty_tier: 'medium',
    objects: [
      { name: 'Bronze Coin', value: 65, weight: 2, is_decoy: false },
      { name: 'Pearl Button', value: 75, weight: 2, is_decoy: false },
      { name: 'Miniature Mask', value: 110, weight: 4, is_decoy: false },
      { name: 'Ancient Ring', value: 140, weight: 3, is_decoy: false },
      { name: 'Velvet Rope Clip', value: 45, weight: 1, is_decoy: false },
      { name: 'Gallery Badge', value: 55, weight: 1, is_decoy: false },
      { name: 'Stone Bust', value: 310, weight: 18, is_decoy: true },
      { name: 'Glass Display Case', value: 360, weight: 20, is_decoy: true }
    ]
  },
  {
    level_number: 3,
    location_name: 'Electronics Store',
    carry_limit: 16,
    time_limit_seconds: 110,
    patrol_speed: 1.6,
    difficulty_tier: 'medium',
    objects: [
      { name: 'Wireless Earbuds', value: 120, weight: 2, is_decoy: false },
      { name: 'Smart Watch', value: 180, weight: 3, is_decoy: false },
      { name: 'USB Drive', value: 60, weight: 1, is_decoy: false },
      { name: 'Action Camera', value: 210, weight: 4, is_decoy: false },
      { name: 'Phone Charger', value: 45, weight: 1, is_decoy: false },
      { name: 'Portable Speaker', value: 150, weight: 5, is_decoy: false },
      { name: 'Gaming Monitor', value: 420, weight: 19, is_decoy: true },
      { name: 'Desktop Tower', value: 520, weight: 24, is_decoy: true }
    ]
  },
  {
    level_number: 4,
    location_name: 'Pawn Shop',
    carry_limit: 18,
    time_limit_seconds: 120,
    patrol_speed: 1.9,
    difficulty_tier: 'hard',
    objects: [
      { name: 'Pocket Watch', value: 260, weight: 4, is_decoy: false },
      { name: 'Ruby Brooch', value: 330, weight: 3, is_decoy: false },
      { name: 'Rare Coin Roll', value: 240, weight: 5, is_decoy: false },
      { name: 'Vintage Lighter', value: 110, weight: 2, is_decoy: false },
      { name: 'Silver Bracelet', value: 190, weight: 3, is_decoy: false },
      { name: 'Engraved Pen', value: 85, weight: 1, is_decoy: false },
      { name: 'Antique Anvil', value: 700, weight: 27, is_decoy: true },
      { name: 'Grandfather Clock', value: 900, weight: 35, is_decoy: true }
    ]
  },
  {
    level_number: 5,
    location_name: 'Airport Luggage Belt',
    carry_limit: 20,
    time_limit_seconds: 130,
    patrol_speed: 2.2,
    difficulty_tier: 'expert',
    objects: [
      { name: 'Designer Sunglasses', value: 220, weight: 2, is_decoy: false },
      { name: 'Passport Wallet', value: 160, weight: 2, is_decoy: false },
      { name: 'Duty Free Perfume', value: 180, weight: 3, is_decoy: false },
      { name: 'Tablet Sleeve', value: 260, weight: 4, is_decoy: false },
      { name: 'Travel Adapter Kit', value: 90, weight: 2, is_decoy: false },
      { name: 'Diamond Cufflinks', value: 480, weight: 1, is_decoy: false },
      { name: 'Oversized Suitcase', value: 850, weight: 28, is_decoy: true },
      { name: 'Golf Club Bag', value: 780, weight: 25, is_decoy: true }
    ]
  }
];

async function seedLevelsIfEmpty() {
  const count = await prisma.level.count();
  if (count > 0) {
    return;
  }

  for (const level of levels) {
    const { objects, carry_limit, time_limit_seconds, difficulty_tier, patrol_speed, ...levelData } = level;
    await prisma.level.create({
      data: {
        level_number: levelData.level_number,
        location_name: levelData.location_name,
        difficulty: difficulty_tier,
        time_limit: time_limit_seconds,
        weight_limit: carry_limit,
        objects: {
          create: objects
        }
      }
    });
  }
  console.log('Seeded Crow Heist levels');
}

async function runSeedScript() {
  await connectDatabase();
  await prisma.level.deleteMany({});
  for (const level of levels) {
    const { objects, carry_limit, time_limit_seconds, difficulty_tier, patrol_speed, ...levelData } = level;
    await prisma.level.create({
      data: {
        level_number: levelData.level_number,
        location_name: levelData.location_name,
        difficulty: difficulty_tier,
        time_limit: time_limit_seconds,
        weight_limit: carry_limit,
        objects: {
          create: objects
        }
      }
    });
  }
  console.log('Re-seeded Crow Heist levels');
  await prisma.$disconnect();
  process.exit(0);
}

if (require.main === module) {
  runSeedScript().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  levels,
  seedLevelsIfEmpty
};
