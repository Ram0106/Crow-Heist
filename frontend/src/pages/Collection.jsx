import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import { getPlayerCollection } from '../api/collection';
import { useRequirePlayer } from '../hooks/useRequirePlayer';

const RARITY_COLORS = {
  legendary: 'text-purple-400 border-purple-400/50 bg-purple-400/10',
  rare: 'text-blue-400 border-blue-400/50 bg-blue-400/10',
  uncommon: 'text-green-400 border-green-400/50 bg-green-400/10',
  common: 'text-gray-400 border-gray-400/50 bg-gray-400/10'
};

const RARITY_ICONS = {
  legendary: '💎',
  rare: '🔵',
  uncommon: '🟢',
  common: '⚪'
};

const RARITY_ORDER = ['legendary', 'rare', 'uncommon', 'common'];

export default function Collection() {
  const playerId = useRequirePlayer();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!playerId) return;
    getPlayerCollection(playerId)
      .then((response) => {
        setItems(response.data.data.items);
        setStats(response.data.data.stats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [playerId]);

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.rarity === filter);

  const grouped = RARITY_ORDER.reduce((acc, rarity) => {
    acc[rarity] = filteredItems.filter(item => item.rarity === rarity);
    return acc;
  }, {});

  if (loading) {
    return (
      <AppLayout>
        <div className="sharp-panel p-6 text-crow-muted">Loading collection...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader eyebrow="Treasure Vault" title="Collection" />

      {stats && (
        <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon="💎" label="Legendary" count={stats.legendary_count} color="text-purple-400" />
          <StatCard icon="🔵" label="Rare" count={stats.rare_count} color="text-blue-400" />
          <StatCard icon="🟢" label="Uncommon" count={stats.uncommon_count} color="text-green-400" />
          <StatCard icon="⚪" label="Common" count={stats.common_count} color="text-gray-400" />
        </section>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
        <FilterButton active={filter === 'legendary'} onClick={() => setFilter('legendary')}>💎 Legendary</FilterButton>
        <FilterButton active={filter === 'rare'} onClick={() => setFilter('rare')}>🔵 Rare</FilterButton>
        <FilterButton active={filter === 'uncommon'} onClick={() => setFilter('uncommon')}>🟢 Uncommon</FilterButton>
        <FilterButton active={filter === 'common'} onClick={() => setFilter('common')}>⚪ Common</FilterButton>
      </div>

      {items.length === 0 ? (
        <div className="sharp-panel p-8 text-center text-crow-muted">
          <p className="text-lg">Your collection is empty.</p>
          <p className="mt-2 text-sm">Complete heists to collect treasures!</p>
        </div>
      ) : (
        RARITY_ORDER.map((rarity) => {
          const rarityItems = grouped[rarity];
          if (filter !== 'all' && rarityItems.length === 0) return null;
          return (
            <section key={rarity} className="mb-8">
              {filter === 'all' && rarityItems.length > 0 && (
                <h2 className={`mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.24em] ${RARITY_COLORS[rarity].split(' ')[0]}`}>
                  <span>{RARITY_ICONS[rarity]}</span>
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  <span className="text-crow-muted">({rarityItems.length})</span>
                </h2>
              )}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {rarityItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className={`border p-4 ${RARITY_COLORS[item.rarity]}`}
                  >
                    <div className="mb-2 text-2xl">{RARITY_ICONS[item.rarity]}</div>
                    <p className="font-semibold text-white">{item.item_name}</p>
                    <p className="mt-1 text-xs text-crow-muted">
                      Total Value: <span className="text-crow-gold">{item.total_value}</span>
                    </p>
                    {item.times_collected > 1 && (
                      <p className="mt-1 text-xs text-crow-muted">
                        Collected: {item.times_collected}x
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </AppLayout>
  );
}

function StatCard({ icon, label, count, color }) {
  return (
    <div className="sharp-panel border-crow-line p-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-crow-muted">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{count}</p>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-4 py-2 text-sm uppercase tracking-[0.1em] transition ${
        active
          ? 'border-crow-gold bg-crow-gold/20 text-crow-gold'
          : 'border-crow-line text-crow-muted hover:border-crow-muted'
      }`}
    >
      {children}
    </button>
  );
}