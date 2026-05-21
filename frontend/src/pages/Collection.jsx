import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import { getPlayerCollection } from '../api/collection';
import { useRequirePlayer } from '../hooks/useRequirePlayer';

const RARITY_COLORS = {
  legendary: {
    border: 'border-accent-gold/50',
    bg: 'bg-accent-gold/10',
    glow: 'hover:shadow-[0_0_25px_rgba(255,200,87,0.3)]',
    badge: 'text-accent-gold border-accent-gold/40 bg-accent-gold/10',
    icon: '★',
  },
  epic: {
    border: 'border-accent-purple/50',
    bg: 'bg-accent-purple/10',
    glow: 'hover:shadow-[0_0_25px_rgba(181,107,255,0.3)]',
    badge: 'text-accent-purple border-accent-purple/40 bg-accent-purple/10',
    icon: '◆',
  },
  rare: {
    border: 'border-accent-blue/50',
    bg: 'bg-accent-blue/10',
    glow: 'hover:shadow-[0_0_25px_rgba(91,155,255,0.3)]',
    badge: 'text-accent-blue border-accent-blue/40 bg-accent-blue/10',
    icon: '◇',
  },
  uncommon: {
    border: 'border-accent-primary/50',
    bg: 'bg-accent-primary/10',
    glow: 'hover:shadow-[0_0_25px_rgba(0,255,209,0.3)]',
    badge: 'text-accent-primary border-accent-primary/40 bg-accent-primary/10',
    icon: '◈',
  },
  common: {
    border: 'border-text-muted/50',
    bg: 'bg-text-muted/10',
    glow: '',
    badge: 'text-text-muted border-text-muted/40 bg-text-muted/10',
    icon: '○',
  },
};

const RARITY_ORDER = ['legendary', 'epic', 'rare', 'uncommon', 'common'];

export default function Collection() {
  const playerId = useRequirePlayer();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

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
    : items.filter((item) => item.rarity === filter);

  const grouped = RARITY_ORDER.reduce((acc, rarity) => {
    acc[rarity] = filteredItems.filter((item) => item.rarity === rarity);
    return acc;
  }, {});

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 border-2 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
            <p className="mt-4 text-sm uppercase tracking-widest text-text-muted">
              Scanning Vault...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyber-card to-cyber-panel border border-cyber-border p-6"
        >
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-accent-gold/5 blur-3xl" />

          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-gold mb-2">
              Treasury
            </p>
            <h1 className="text-3xl font-bold text-text-primary uppercase tracking-wider">
              Loot Collection
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Your amassed treasures from countless heists.
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {RARITY_ORDER.map((rarity, index) => {
              const color = RARITY_COLORS[rarity];
              const count = stats[`${rarity}_count`] || 0;

              return (
                <motion.div
                  key={rarity}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`cyber-card p-4 border ${color.border} ${color.bg}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xl ${color.badge.split(' ')[0]}`}>
                      {color.icon}
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-text-muted">
                        {rarity}
                      </p>
                      <p className={`text-xl font-bold ${color.badge.split(' ')[0]}`}>
                        {count}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All Items
          </FilterButton>
          {RARITY_ORDER.map((rarity) => (
            <FilterButton
              key={rarity}
              active={filter === rarity}
              onClick={() => setFilter(rarity)}
              color={rarity}
            >
              {RARITY_COLORS[rarity].icon} {rarity}
            </FilterButton>
          ))}
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cyber-card p-12 text-center"
          >
            <div className="mb-4 text-5xl text-text-dim animate-float">◇</div>
            <p className="text-lg font-semibold text-text-primary uppercase tracking-wider">
              Vault Empty
            </p>
            <p className="mt-2 text-sm text-text-muted max-w-md mx-auto">
              No treasures acquired yet. Complete heists to collect valuable loot and grow your criminal empire.
            </p>
          </motion.div>
        ) : (
          RARITY_ORDER.map((rarity) => {
            const rarityItems = grouped[rarity];
            if (filter !== 'all' && rarityItems.length === 0) return null;

            return (
              <motion.section key={rarity} className="space-y-4">
                {filter === 'all' && rarityItems.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className={`text-xl ${RARITY_COLORS[rarity].badge.split(' ')[0]}`}>
                      {RARITY_COLORS[rarity].icon}
                    </span>
                    <h2 className={`text-sm uppercase tracking-[0.24em] font-semibold ${
                      RARITY_COLORS[rarity].badge.split(' ')[0]
                    }`}>
                      {rarity}
                    </h2>
                    <div className="flex-1 h-px bg-cyber-border" />
                    <span className="text-xs text-text-muted">
                      {rarityItems.length} items
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {rarityItems.map((item, index) => {
                    const color = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.03, type: 'spring', stiffness: 300 }}
                        whileHover={{
                          scale: 1.08,
                          y: -6,
                          transition: { type: 'spring', stiffness: 400, damping: 15 }
                        }}
                        onClick={() => setSelectedItem(item)}
                        className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-300 ${color.border} ${color.bg} ${color.glow}`}
                      >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />

                        {/* Item Icon */}
                        <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${color.bg} border ${color.border}`}>
                          <span className={`text-lg ${color.badge.split(' ')[0]}`}>
                            {color.icon}
                          </span>
                        </div>

                        {/* Item Name */}
                        <p className="text-sm font-medium text-text-primary truncate">
                          {item.item_name}
                        </p>

                        {/* Item Value */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-text-muted">Value</span>
                          <span className="text-sm font-bold text-accent-gold">
                            {item.total_value}
                          </span>
                        </div>

                        {/* Collection Count */}
                        {item.times_collected > 1 && (
                          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-gold text-[10px] font-bold text-cyber-bg">
                            ×{item.times_collected}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            );
          })
        )}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`cyber-card max-w-sm w-full p-6 border ${
                RARITY_COLORS[selectedItem.rarity]?.border || RARITY_COLORS.common.border
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`cyber-badge ${RARITY_COLORS[selectedItem.rarity]?.badge || RARITY_COLORS.common.badge}`}>
                    {selectedItem.rarity}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-text-muted hover:text-text-primary text-xl"
                >
                  ×
                </button>
              </div>

              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-xl ${RARITY_COLORS[selectedItem.rarity]?.bg || RARITY_COLORS.common.bg} border ${RARITY_COLORS[selectedItem.rarity]?.border || RARITY_COLORS.common.border}`}>
                <span className={`text-3xl ${RARITY_COLORS[selectedItem.rarity]?.badge.split(' ')[0] || ''}`}>
                  {RARITY_COLORS[selectedItem.rarity]?.icon || RARITY_COLORS.common.icon}
                </span>
              </div>

              <h3 className="text-xl font-bold text-text-primary">{selectedItem.item_name}</h3>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between py-2 border-b border-cyber-border">
                  <span className="text-sm text-text-muted">Total Value</span>
                  <span className="text-sm font-bold text-accent-gold">
                    {selectedItem.total_value}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-cyber-border">
                  <span className="text-sm text-text-muted">Times Collected</span>
                  <span className="text-sm font-bold text-text-primary">
                    {selectedItem.times_collected}×
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-text-muted">Rarity</span>
                  <span className={`text-sm font-bold uppercase ${
                    RARITY_COLORS[selectedItem.rarity]?.badge.split(' ')[0] || ''
                  }`}>
                    {selectedItem.rarity}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

function FilterButton({ active, onClick, children, color }) {
  const colorStyles = color
    ? RARITY_COLORS[color]
      ? `border-${RARITY_COLORS[color].badge.split(' ')[0].replace('text-', '')} ${RARITY_COLORS[color].badge}`
      : ''
    : '';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-lg border px-4 py-2 text-xs uppercase tracking-[0.1em] transition-all duration-200 ${
        active
          ? 'border-accent-gold bg-accent-gold/20 text-accent-gold glow-border-gold'
          : 'border-cyber-border text-text-muted hover:border-accent-primary hover:text-accent-primary'
      } ${colorStyles}`}
    >
      {children}
    </motion.button>
  );
}