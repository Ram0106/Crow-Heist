import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
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
      .catch((requestError) => setError(requestError.message));
  }, [playerId]);

  return (
    <AppLayout>
      <PageHeader eyebrow="Choose Entry Point" title="Level Select" />
      {error ? <p className="mb-4 text-crow-red">{error}</p> : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {levels.map((level) => {
          const locked = level.level_number > currentLevel;
          const result = levelResults[level.level_number];
          return (
            <motion.button
              key={level.level_number}
              type="button"
              disabled={locked}
              whileHover={!locked ? { scale: 1.02 } : {}}
              whileTap={!locked ? { scale: 0.98 } : {}}
              onClick={() => navigate(`/heist/${level.level_number}`)}
              className={`h-52 border p-5 text-left transition ${
                locked
                  ? 'border-crow-line bg-crow-line/40 text-crow-muted'
                  : 'border-crow-line bg-crow-panel hover:border-crow-gold'
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="text-xs uppercase tracking-[0.24em] text-crow-muted">
                  {locked ? 'Locked' : `Level ${level.level_number}`}
                </p>
                {!locked && result && (
                  <StarRating stars={result.stars} />
                )}
              </div>
              <h2 className="location-font mt-4 text-3xl font-bold text-white">{locked ? 'Lock' : level.location_name}</h2>
              <div className="mt-8 grid gap-1 text-sm">
                <p>Difficulty: <span className="text-crow-gold">{level.difficulty_tier}</span></p>
                <p>Best Score: <span className="text-crow-muted">{result ? result.best_score : 'Not recorded'}</span></p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </AppLayout>
  );
}

function StarRating({ stars }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((star) => (
        <span
          key={star}
          className={`text-lg ${star <= stars ? 'text-crow-gold' : 'text-crow-line'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}