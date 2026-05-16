const { prisma } = require('../config/database');

async function getPlayerCollection(req, res, next) {
  try {
    const { playerId } = req.params;

    const items = await prisma.collectedItem.findMany({
      where: { player_id: playerId },
      orderBy: [{ rarity: 'desc' }, { total_value: 'desc' }]
    });

    const stats = {
      total_items: items.length,
      legendary_count: items.filter(i => i.rarity === 'legendary').length,
      rare_count: items.filter(i => i.rarity === 'rare').length,
      uncommon_count: items.filter(i => i.rarity === 'uncommon').length,
      common_count: items.filter(i => i.rarity === 'common').length,
      total_collection_value: items.reduce((sum, i) => sum + i.total_value, 0)
    };

    return res.json({
      success: true,
      data: { items, stats },
      error: null
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPlayerCollection
};