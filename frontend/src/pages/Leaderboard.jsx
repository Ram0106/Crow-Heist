import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import LeaderboardTable from '../components/LeaderboardTable';
import { getDailyLeaderboard, getGlobalLeaderboard } from '../api/leaderboard';
import { useRequirePlayer } from '../hooks/useRequirePlayer';

export default function Leaderboard() {
  const playerId = useRequirePlayer();
  const [tab, setTab] = useState('today');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const loader = tab === 'today' ? getDailyLeaderboard : getGlobalLeaderboard;
    loader()
      .then((response) => setRows(response.data.leaderboard))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyber-card to-cyber-panel border border-cyber-border p-6"
        >
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-accent-primary/5 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent-primary mb-2">Global Rankings</p>
              <h1 className="text-3xl font-bold text-text-primary uppercase tracking-wider">Rivals Board</h1>
              <p className="mt-2 text-sm text-text-muted">Compete with fellow operatives for glory and dominance.</p>
            </div>

            {rows.length > 0 && (
              <div className="flex items-center gap-4">
                {[0, 1, 2].map((i) => {
                  if (!rows[i]) return null;
                  const player = rows[i].player || {};
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className={`text-center ${i === 0 ? 'order-2 -mt-4' : i === 1 ? 'order-1' : 'order-3'}`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl mx-auto mb-2 text-lg font-bold border-2 ${
                        i === 0
                          ? 'bg-accent-gold/20 text-accent-gold border-accent-gold'
                          : i === 1
                            ? 'bg-gray-400/20 text-gray-300 border-gray-400'
                            : 'bg-amber-600/20 text-amber-600 border-amber-600'
                      }`}>
                        {(player.username || '?').charAt(0).toUpperCase()}
                      </div>
                      <p className={`text-xs font-medium ${i === 0 ? 'text-accent-gold' : 'text-text-muted'}`}>#{rows[i].rank}</p>
                      <p className="text-[10px] text-text-dim truncate max-w-[60px]">{player.username}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex gap-2">
          <TabButton active={tab === 'today'} onClick={() => setTab('today')}>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
              Today
            </span>
          </TabButton>
          <TabButton active={tab === 'all'} onClick={() => setTab('all')}>
            All Time
          </TabButton>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cyber-card p-6 border border-accent-danger/50 bg-accent-danger/5"
          >
            <p className="text-accent-danger text-center">{error}</p>
          </motion.div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="inline-block h-10 w-10 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
          </div>
        )}

        {!loading && rows.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cyber-card p-12 text-center"
          >
            <div className="mb-4 text-5xl text-text-dim">◇</div>
            <p className="text-lg font-semibold text-text-primary uppercase tracking-wider">No Records Yet</p>
            <p className="mt-2 text-sm text-text-muted">Be the first to establish dominance today.</p>
          </motion.div>
        )}

        {!loading && rows.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="cyber-card overflow-hidden"
          >
            <LeaderboardTable rows={rows} currentPlayerId={playerId} />
          </motion.section>
        )}
      </div>
    </AppLayout>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-3 text-sm uppercase tracking-[0.2em] font-medium rounded-xl border transition-all duration-200 ${
        active
          ? 'border-accent-primary bg-accent-primary/10 text-accent-primary glow-border'
          : 'border-cyber-border text-text-muted hover:border-accent-primary hover:text-accent-primary'
      }`}
    >
      {children}
    </motion.button>
  );
}