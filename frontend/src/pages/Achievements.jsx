import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import { getAllAchievements, getPlayerAchievements } from '../api/achievement';
import { useRequirePlayer } from '../hooks/useRequirePlayer';

const CATEGORY_ICONS = {
  starter: '🚀',
  score: '💰',
  progress: '📈',
  daily: '📅',
  skill: '🎯'
};

const CATEGORY_LABELS = {
  starter: 'Starter',
  score: 'Score Milestones',
  progress: 'Progress',
  daily: 'Daily Streaks',
  skill: 'Skills'
};

export default function Achievements() {
  const playerId = useRequirePlayer();
  const [allAchievements, setAllAchievements] = useState([]);
  const [playerAchievements, setPlayerAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return;

    Promise.all([
      getAllAchievements(),
      getPlayerAchievements(playerId)
    ])
      .then(([allRes, playerRes]) => {
        setAllAchievements(allRes.data.data.achievements);
        setPlayerAchievements(playerRes.data.data.achievements);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [playerId]);

  const earnedIds = new Set(playerAchievements.map(pa => pa.achievement.id));

  const grouped = allAchievements.reduce((acc, achievement) => {
    const cat = achievement.category || 'starter';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(achievement);
    return acc;
  }, {});

  if (loading) {
    return (
      <AppLayout>
        <div className="sharp-panel p-6 text-crow-muted">Loading achievements...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader eyebrow="Collection" title="Achievements" />

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-crow-muted">
          {playerAchievements.length} / {allAchievements.length} unlocked
        </p>
        <div className="h-2 w-48 rounded-full bg-crow-line">
          <div
            className="h-full rounded-full bg-crow-gold transition-all"
            style={{ width: `${(playerAchievements.length / allAchievements.length) * 100}%` }}
          />
        </div>
      </div>

      {Object.entries(grouped).map(([category, achievements]) => (
        <section key={category} className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-crow-gold">
            <span>{CATEGORY_ICONS[category] || '🏆'}</span>
            {CATEGORY_LABELS[category] || category}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => {
              const earned = earnedIds.has(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`sharp-panel p-4 transition-all ${
                    earned
                      ? 'border-crow-gold bg-crow-gold/10'
                      : 'opacity-50 grayscale'
                  }`}
                >
                  <div className="mb-2 text-3xl">{achievement.icon}</div>
                  <h3 className="font-semibold text-white">{achievement.name}</h3>
                  <p className="mt-1 text-xs text-crow-muted">{achievement.description}</p>
                  {!earned && (
                    <p className="mt-2 text-xs text-crow-muted">
                      Requirement: {achievement.requirement}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </AppLayout>
  );
}