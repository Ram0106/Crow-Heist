import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import CountUp from '../components/CountUp';
import NestGrid from '../components/NestGrid';
import { usePlayerStore } from '../store/playerStore';

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const nestItems = usePlayerStore((state) => state.nest_items);
  const result = location.state?.result;
  const levelNumber = location.state?.levelNumber || result?.heist_result?.level_number;
  const breakdown = result?.score_breakdown;
  const heistResult = result?.heist_result;
  const unlockedLevels = result?.unlocked_levels || [];
  const newAchievements = result?.new_achievements || [];
  const nextLevelNumber = Number(levelNumber || 1) + 1;
  const canPlayNextLevel = breakdown?.success && unlockedLevels.includes(nextLevelNumber);

  const newItems = useMemo(() => {
    const selected = heistResult?.selected_objects || [];
    if (!breakdown?.success) return [];
    return selected.filter((item) => !item.is_decoy);
  }, [breakdown, heistResult]);

  if (!result) {
    return (
      <AppLayout>
        <div className="cyber-card p-6 text-text-muted">
          No mission data available.
        </div>
      </AppLayout>
    );
  }

  const isSuccess = breakdown?.success;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Result Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative overflow-hidden rounded-2xl border p-6 ${
            isSuccess
              ? 'bg-gradient-to-br from-accent-gold/10 to-transparent border-accent-gold/30'
              : 'bg-gradient-to-br from-accent-danger/10 to-transparent border-accent-danger/30'
          }`}
        >
          {/* Background Glow */}
          <div className={`absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl ${
            isSuccess ? 'bg-accent-gold/10' : 'bg-accent-danger/10'
          }`} />

          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted mb-2 flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${isSuccess ? 'bg-accent-gold animate-pulse' : 'bg-accent-danger animate-pulse'}`} />
              Mission Status
            </p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-5xl font-bold uppercase tracking-wider ${
                isSuccess ? 'text-gradient-gold' : 'text-accent-danger'
              }`}
            >
              {isSuccess ? 'Extraction Complete' : 'Mission Failed'}
            </motion.h1>

            {/* Stars Rating */}
            {isSuccess && breakdown.stars > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex items-center gap-3"
              >
                {[1, 2, 3].map((star) => (
                  <motion.span
                    key={star}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + star * 0.15, type: 'spring', stiffness: 200 }}
                    className={`text-4xl ${
                      star <= breakdown.stars
                        ? 'text-accent-gold drop-shadow-[0_0_10px_rgba(255,200,87,0.5)]'
                        : 'text-cyber-line'
                    }`}
                  >
                    ★
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="ml-2 text-sm uppercase tracking-wider text-text-muted"
                >
                  {breakdown.stars === 3 ? 'Perfect Heist!' : breakdown.stars === 2 ? 'Excellent Work!' : 'Clean Job!'}
                </motion.span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Score Breakdown & Loot Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Score Breakdown */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="cyber-card p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent-primary mb-4">
              Financial Report
            </p>

            <div className="space-y-4">
              <ScoreRow label="Base Score" value={breakdown.baseScore} delay={0.3} />
              <ScoreRow label="Time Multiplier" value={`${breakdown.timeBonusMultiplier}×`} plain delay={0.4} />
              <ScoreRow label="Decoy Penalty" value={`-${breakdown.decoyPenaltyPercent}%`} plain danger delay={0.5} />
              <div className="border-t border-cyber-border pt-4">
                <ScoreRow label="Total Earnings" value={breakdown.score} large highlight delay={0.6} />
              </div>
            </div>
          </motion.section>

          {/* Newly Acquired Loot */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="cyber-card p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent-gold mb-4">
              Inventory Update
            </p>

            <h2 className="text-2xl font-bold text-text-primary uppercase tracking-wider">
              Recently Claimed
            </h2>

            <div className="mt-6">
              <NestGrid items={newItems.length > 0 ? newItems : nestItems.slice(-4)} animated />
            </div>
          </motion.section>
        </div>

        {/* New Achievements */}
        {newAchievements.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="cyber-card border border-accent-gold/30 p-6 glow-border-gold"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🏆</span>
              <p className="text-xs uppercase tracking-[0.3em] text-accent-gold">
                Achievement Unlocked!
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {newAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="flex items-center gap-3 rounded-xl border border-accent-gold/30 bg-accent-gold/5 p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-gold/30 bg-accent-gold/10 text-2xl">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{achievement.name}</h3>
                    <p className="text-xs text-text-muted mt-1">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-3"
        >
          <motion.button
            type="button"
            onClick={() => navigate(`/heist/${levelNumber}`)}
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 209, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-cyber-border px-6 py-3 text-sm uppercase tracking-[0.2em] font-medium text-text-primary hover:border-accent-primary hover:text-accent-primary transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <span>↻</span> Retry Mission
            </span>
          </motion.button>

          {canPlayNextLevel && (
            <motion.button
              type="button"
              onClick={() => navigate(`/heist/${nextLevelNumber}`)}
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(255, 200, 87, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="btn-gold rounded-xl px-6 py-3 text-sm uppercase tracking-[0.2em] font-medium"
            >
              <span className="flex items-center gap-2">
                Next Operation <span>→</span>
              </span>
            </motion.button>
          )}

          <motion.button
            type="button"
            onClick={() => navigate('/home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-cyber-border px-6 py-3 text-sm uppercase tracking-[0.2em] font-medium text-text-muted hover:border-accent-primary hover:text-accent-primary transition-all duration-200"
          >
            Return to Command
          </motion.button>
        </motion.div>
      </div>
    </AppLayout>
  );
}

function ScoreRow({ label, value, large, plain, danger, highlight, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`flex items-center justify-between py-3 ${highlight ? 'border-t border-cyber-border' : 'border-b border-cyber-border/50'}`}
    >
      <span className="text-sm uppercase tracking-[0.2em] text-text-muted">{label}</span>
      <span className={`font-semibold ${
        large
          ? 'text-3xl text-accent-gold'
          : danger
            ? 'text-xl text-accent-danger'
            : plain
              ? 'text-xl text-text-primary'
              : 'text-xl text-accent-gold'
      }`}>
        {plain ? value : <CountUp value={value} />}
      </span>
    </motion.div>
  );
}