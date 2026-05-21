import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import { getAvailableLevels } from '../api/player';
import { getPlayerLevelResults } from '../api/levelResult';
import { useRequirePlayer } from '../hooks/useRequirePlayer';
import { usePlayerStore } from '../store/playerStore';

export default function LevelSelect() {
  const navigate = useNavigate();
  const playerId = useRequirePlayer();
  const currentLevel = usePlayerStore((state) => state.current_level);
  const [levels, setLevels] = useState([]);
  const [levelResults, setLevelResults] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!playerId) return;
    Promise.all([
      getAvailableLevels(playerId),
      getPlayerLevelResults(playerId)
    ])
      .then(([levelsRes, resultsRes]) => {
        setLevels(levelsRes.data.levels);
        const resultsMap = {};
        for (const result of resultsRes.data.level_results || []) {
          resultsMap[result.level_number] = result;
        }
        setLevelResults(resultsMap);
      })
      .catch((err) => setError(err.message));
  }, [playerId]);

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
            <p className="text-xs uppercase tracking-[0.3em] text-accent-gold mb-2">Strategic Operations</p>
            <h1 className="text-3xl font-bold text-text-primary uppercase tracking-wider">Select Target</h1>
            <p className="mt-2 text-sm text-text-muted">Choose your infiltration point. Each location presents unique challenges.</p>
          </div>
        </motion.div>

        {error && (
          <div className="cyber-card p-4 border border-accent-danger/50 bg-accent-danger/5">
            <p className="text-accent-danger text-center">{error}</p>
          </div>
        )}

        {/* Mission Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {levels.map((level, index) => {
            const locked = level.level_number > currentLevel;
            const result = levelResults[level.level_number];
            const difficultyColors = {
              easy: 'text-accent-primary border-accent-primary/30 bg-accent-primary/10',
              medium: 'text-accent-gold border-accent-gold/30 bg-accent-gold/10',
              hard: 'text-accent-danger border-accent-danger/30 bg-accent-danger/10',
            };
            const difficultyStyle = difficultyColors[level.difficulty_tier?.toLowerCase()] || difficultyColors.medium;

            return (
              <motion.button
                key={level.level_number}
                type="button"
                disabled={locked}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={!locked ? { scale: 1.02, y: -4 } : {}}
                whileTap={!locked ? { scale: 0.98 } : {}}
                onClick={() => navigate(`/heist/${level.level_number}`)}
                className={`relative rounded-2xl border p-5 text-left transition-all duration-300 overflow-hidden ${
                  locked
                    ? 'border-cyber-border bg-cyber-card/50 opacity-60 cursor-not-allowed'
                    : 'border-cyber-border bg-cyber-card hover:border-accent-gold hover:glow-border-gold'
                }`}
              >
                <div className={`absolute top-0 right-0 h-24 w-24 rounded-full blur-2xl ${
                  locked ? 'bg-text-dim/10' : 'bg-accent-gold/10'
                }`} />

                {locked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-cyber-bg/60 z-10">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🔒</div>
                      <p className="text-xs uppercase tracking-wider text-text-muted">Requires Level {level.level_number - 1}</p>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <p className={`cyber-badge ${difficultyStyle}`}>
                      {locked ? 'Locked' : level.difficulty_tier}
                    </p>
                    {result && !locked && <StarRating stars={result.stars} />}
                  </div>

                  <h2 className={`text-xl font-bold uppercase tracking-wider ${locked ? 'text-text-dim' : 'text-text-primary'}`}>
                    {locked ? 'Classified' : level.location_name}
                  </h2>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className={`rounded-lg p-2.5 ${locked ? 'bg-cyber-panel/50' : 'bg-cyber-panel'}`}>
                      <p className="text-[10px] uppercase tracking-wider text-text-muted">Best Score</p>
                      <p className={`text-sm font-bold mt-1 ${locked ? 'text-text-dim' : 'text-accent-gold'}`}>
                        {result ? result.best_score.toLocaleString() : '---'}
                      </p>
                    </div>
                    <div className={`rounded-lg p-2.5 ${locked ? 'bg-cyber-panel/50' : 'bg-cyber-panel'}`}>
                      <p className="text-[10px] uppercase tracking-wider text-text-muted">Level</p>
                      <p className={`text-sm font-bold mt-1 ${locked ? 'text-text-dim' : 'text-accent-primary'}`}>
                        {level.level_number}
                      </p>
                    </div>
                  </div>

                  {!locked && (
                    <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wider text-accent-primary">
                      <span>Infiltrate</span><span>→</span>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {levels.length === 0 && !error && (
          <div className="cyber-card p-12 text-center">
            <div className="mb-4 text-5xl text-text-dim animate-float">◇</div>
            <p className="text-lg font-semibold text-text-primary uppercase tracking-wider">No Targets Available</p>
            <p className="mt-2 text-sm text-text-muted">New operations will appear as you progress.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function StarRating({ stars }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((star) => (
        <motion.span
          key={star}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: star * 0.1 }}
          className={`text-lg ${star <= stars ? 'text-accent-gold drop-shadow-[0_0_4px_rgba(255,200,87,0.5)]' : 'text-cyber-line'}`}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}