import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import { getAllAchievements, getPlayerAchievements } from '../api/achievement';
import { useRequirePlayer } from '../hooks/useRequirePlayer';

const CATEGORY_ICONS = {
  starter: '◈',
  score: '◆',
  progress: '◇',
  daily: '◉',
  skill: '◎',
};

const CATEGORY_LABELS = {
  starter: 'Initiate',
  score: 'Score Hunter',
  progress: 'Rising Star',
  daily: 'Consistency',
  skill: 'Specialist',
};

const RARITY_STYLES = {
  legendary: {
    border: 'border-accent-gold/40',
    bg: 'bg-accent-gold/5',
    glow: 'hover:shadow-[0_0_30px_rgba(255,200,87,0.3)]',
    badge: 'bg-accent-gold/20 text-accent-gold border-accent-gold/30',
  },
  epic: {
    border: 'border-accent-purple/40',
    bg: 'bg-accent-purple/5',
    glow: 'hover:shadow-[0_0_30px_rgba(181,107,255,0.3)]',
    badge: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
  },
  rare: {
    border: 'border-accent-blue/40',
    bg: 'bg-accent-blue/5',
    glow: 'hover:shadow-[0_0_30px_rgba(91,155,255,0.3)]',
    badge: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
  },
  common: {
    border: 'border-text-muted/40',
    bg: 'bg-text-muted/5',
    glow: '',
    badge: 'bg-text-muted/20 text-text-muted border-text-muted/30',
  },
};

export default function Achievements() {
  const playerId = useRequirePlayer();
  const [allAchievements, setAllAchievements] = useState([]);
  const [playerAchievements, setPlayerAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!playerId) return;

    Promise.all([getAllAchievements(), getPlayerAchievements(playerId)])
      .then(([allRes, playerRes]) => {
        setAllAchievements(allRes.data.data.achievements);
        setPlayerAchievements(playerRes.data.data.achievements);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [playerId]);

  const earnedIds = new Set(playerAchievements.map((pa) => pa.achievement.id));

  const grouped = allAchievements.reduce((acc, achievement) => {
    const cat = achievement.category || 'starter';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(achievement);
    return acc;
  }, {});

  const progress = allAchievements.length > 0
    ? (playerAchievements.length / allAchievements.length) * 100
    : 0;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
            <p className="mt-4 text-sm uppercase tracking-widest text-text-muted">
              Loading Vault...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyber-card to-cyber-panel border border-cyber-border p-6"
        >
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-accent-gold/5 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent-gold mb-2">
                Trophy Vault
              </p>
              <h1 className="text-3xl font-bold text-text-primary uppercase tracking-wider">
                Achievements
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                Your criminal empire grows stronger with each accomplishment.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <span className="text-3xl font-bold text-accent-gold">
                  {playerAchievements.length}
                </span>
                <span className="text-text-muted"> / {allAchievements.length}</span>
              </div>
              <div className="w-48 h-2 bg-cyber-line rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-accent-gold to-accent-primary rounded-full"
                />
              </div>
              <p className="text-xs text-text-muted uppercase tracking-wider">
                Collection Progress
              </p>
            </div>
          </div>
        </motion.div>

        {/* Achievement Categories */}
        {Object.entries(grouped).map(([category, achievements], catIndex) => (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            className="space-y-4"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <span className="text-xl text-accent-primary">{CATEGORY_ICONS[category] || '◆'}</span>
              <h2 className="text-sm uppercase tracking-[0.24em] text-accent-gold font-semibold">
                {CATEGORY_LABELS[category] || category}
              </h2>
              <div className="flex-1 h-px bg-cyber-border" />
              <span className="text-xs text-text-muted">
                {achievements.filter((a) => earnedIds.has(a.id)).length}/{achievements.length}
              </span>
            </div>

            {/* Achievement Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement, index) => {
                const earned = earnedIds.has(achievement.id);
                const style = RARITY_STYLES[achievement.rarity] || RARITY_STYLES.common;
                const isExpanded = expandedId === achievement.id;

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => setExpandedId(isExpanded ? null : achievement.id)}
                    className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
                      earned
                        ? `${style.border} ${style.bg} ${style.glow}`
                        : 'border-cyber-border bg-cyber-card opacity-60 grayscale'
                    }`}
                  >
                    {/* Lock Icon for Unearned */}
                    {!earned && (
                      <div className="absolute top-3 right-3 text-text-dim">
                        <span className="text-sm">🔒</span>
                      </div>
                    )}

                    {/* Achievement Icon */}
                    <div
                      className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl border text-2xl ${
                        earned
                          ? style.border
                          : 'border-text-dim/30'
                      } ${earned ? style.bg : 'bg-text-dim/10'}`}
                    >
                      {achievement.icon}
                    </div>

                    {/* Achievement Info */}
                    <h3 className={`font-semibold ${earned ? 'text-text-primary' : 'text-text-muted'}`}>
                      {achievement.name}
                    </h3>
                    <p className="mt-1 text-xs text-text-muted line-clamp-2">
                      {achievement.description}
                    </p>

                    {/* Rarity Badge */}
                    <div className={`mt-3 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] uppercase tracking-wider ${style.badge}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {achievement.rarity || 'common'}
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && earned && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-cyber-border">
                            <p className="text-xs text-text-muted">
                              <span className="text-text-primary">Requirement:</span>{' '}
                              {achievement.requirement}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-accent-primary">
                              <span>✦</span>
                              <span>Achievement Unlocked</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Unlock Animation Glow */}
                    {earned && (
                      <div className="absolute inset-0 rounded-xl border-2 border-accent-gold/20 animate-pulse-gold pointer-events-none" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}

        {/* Empty State */}
        {allAchievements.length === 0 && (
          <div className="cyber-card p-12 text-center">
            <div className="mb-4 text-5xl text-text-dim">◇</div>
            <p className="text-lg font-semibold text-text-primary uppercase tracking-wider">
              No Legends Yet
            </p>
            <p className="mt-2 text-sm text-text-muted max-w-md mx-auto">
              Your criminal empire is still growing. Complete heists and achieve milestones to unlock prestigious badges.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}