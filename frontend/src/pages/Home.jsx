import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import NestGrid from '../components/NestGrid';
import { getPlayer } from '../api/player';
import { usePlayerStore } from '../store/playerStore';
import { useRequirePlayer } from '../hooks/useRequirePlayer';
import { formatDate } from '../utils/heistMath';

export default function Home() {
  const navigate = useNavigate();
  const playerId = useRequirePlayer();
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const player = usePlayerStore();
  const [recentHistory] = useState([]);

  const canPlayCurrentLevel = player.unlocked_levels?.includes(player.current_level);
  const primaryDestination = canPlayCurrentLevel ? `/heist/${player.current_level}` : '/levels';
  const primaryLabel = canPlayCurrentLevel ? 'Continue Heist' : 'Replay Operations';
  const primaryEyebrow = canPlayCurrentLevel ? 'Active Mission' : 'Standby';

  useEffect(() => {
    if (!playerId) return;

    getPlayer(playerId)
      .then((response) => setPlayer(response.data.player))
      .catch(() => {});
  }, [playerId, setPlayer]);

  const xpProgress = Math.min((player.xp_points || 0) / 1000, 1) * 100;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyber-card to-cyber-panel border border-cyber-border p-6"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-accent-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent-gold/5 blur-3xl" />

          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-primary mb-2">
              {primaryEyebrow}
            </p>
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome back, <span className="text-gradient-gold">{player.username || 'Operative'}</span>
            </h1>

            {/* XP Progress */}
            <div className="mt-6 max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-text-muted">
                  Experience Points
                </span>
                <span className="text-xs text-accent-primary font-medium">
                  {player.xp_points || 0} / 1000 XP
                </span>
              </div>
              <div className="h-2 bg-cyber-line rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-gold rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon="◆"
            label="Total Score"
            value={player.total_score || 0}
            color="text-accent-gold"
            delay={0.1}
          />
          <StatCard
            icon="◈"
            label="Current Level"
            value={player.current_level || 1}
            color="text-accent-primary"
            delay={0.15}
          />
          <StatCard
            icon="◇"
            label="Daily Streak"
            value={player.daily_streak || 0}
            color="text-accent-danger"
            delay={0.2}
          />
          <StatCard
            icon="◆"
            label="Items Looted"
            value={player.nest_items?.length || 0}
            color="text-accent-purple"
            delay={0.25}
          />
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ActionCard
            eyebrow={primaryEyebrow}
            title={primaryLabel}
            description={
              canPlayCurrentLevel
                ? 'Continue your current heist operation'
                : 'Review and replay previous heist missions'
            }
            icon="◈"
            color="primary"
            onClick={() => navigate(primaryDestination)}
            delay={0.3}
          />
          <ActionCard
            eyebrow="Time-Limited"
            title="Daily Heist"
            description="New challenge available every 24 hours"
            icon="◇"
            color="gold"
            onClick={() => navigate('/daily')}
            delay={0.35}
          />
          <ActionCard
            eyebrow="Achievements"
            title="View Badges"
            description="Track your progress and unlock rewards"
            icon="◆"
            color="purple"
            onClick={() => navigate('/achievements')}
            delay={0.4}
          />
        </div>

        {/* Recent Heists Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="cyber-card p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-[0.24em] text-text-muted flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
              Recent Operations
            </h2>
            <button
              type="button"
              onClick={() => navigate('/leaderboard')}
              className="text-xs uppercase tracking-wider text-accent-primary hover:text-accent-gold transition-colors"
            >
              View All →
            </button>
          </div>

          {recentHistory.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-4xl text-text-dim">◇</div>
              <p className="text-text-muted">
                No heists recorded. Somewhere, something valuable awaits.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyber-line text-xs uppercase tracking-[0.2em] text-text-muted">
                    <th className="pb-3 text-left">Location</th>
                    <th className="pb-3 text-left">Score</th>
                    <th className="pb-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentHistory.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-cyber-line/50 transition-colors hover:bg-cyber-panel"
                    >
                      <td className="py-3 text-text-primary">{row.location}</td>
                      <td className="py-3 text-accent-gold">{row.score}</td>
                      <td className="py-3 text-text-muted">{formatDate(row.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </div>
    </AppLayout>
  );
}

function StatCard({ icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="cyber-card p-4 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">{label}</p>
          <motion.p
            className={`mt-2 text-2xl font-bold ${color}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.1, type: 'spring' }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.p>
        </div>
        <div className={`text-2xl ${color} opacity-50 group-hover:opacity-100 transition-opacity`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function ActionCard({ eyebrow, title, description, icon, color, onClick, delay }) {
  const colorClasses = {
    primary: 'border-accent-primary/30 hover:border-accent-primary hover:glow-border',
    gold: 'border-accent-gold/30 hover:border-accent-gold hover:glow-border-gold',
    purple: 'border-accent-purple/30 hover:border-accent-purple hover:shadow-[0_0_20px_rgba(181,107,255,0.2)]',
    danger: 'border-accent-danger/30 hover:border-accent-danger hover:shadow-[0_0_20px_rgba(255,77,109,0.2)]',
  };

  const iconColors = {
    primary: 'text-accent-primary',
    gold: 'text-accent-gold',
    purple: 'text-accent-purple',
    danger: 'text-accent-danger',
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cyber-card p-6 text-left border transition-all duration-300 ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted">{eyebrow}</p>
        <span className={`text-2xl ${iconColors[color]}`}>{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-text-primary uppercase tracking-wider">
        {title}
      </h3>
      <p className="mt-2 text-sm text-text-muted">{description}</p>

      <div className={`mt-4 flex items-center gap-2 text-xs uppercase tracking-wider ${iconColors[color]}`}>
        <span>Execute</span>
        <span>→</span>
      </div>
    </motion.button>
  );
}