import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
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
  const canPlayCurrentLevel = player.unlocked_levels.includes(player.current_level);
  const primaryDestination = canPlayCurrentLevel ? `/heist/${player.current_level}` : '/levels';
  const primaryLabel = canPlayCurrentLevel ? 'Play Next Level' : 'Replay Levels';
  const primaryEyebrow = canPlayCurrentLevel ? 'Move' : 'Route';

  useEffect(() => {
    if (!playerId) return;

    getPlayer(playerId)
      .then((response) => setPlayer(response.data.player))
      .catch(() => {});
  }, [playerId, setPlayer]);

  return (
    <AppLayout>
      <PageHeader eyebrow="Roost" title="The Nest" />

      <section className="mb-8">
        <h2 className="mb-3 text-sm uppercase tracking-[0.24em] text-crow-muted">Collected Items</h2>
        <NestGrid items={player.nest_items} />
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate(primaryDestination)}
          className="sharp-panel p-8 text-left hover:border-crow-gold"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-crow-gold">{primaryEyebrow}</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{primaryLabel}</h3>
        </button>
        <button
          type="button"
          onClick={() => navigate('/daily')}
          className="sharp-panel p-8 text-left hover:border-crow-gold"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-crow-gold">Daily</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">Daily Heist</h3>
        </button>
      </section>

      <section className="sharp-panel overflow-x-auto p-5">
        <h2 className="mb-4 text-sm uppercase tracking-[0.24em] text-crow-muted">Recent Heists</h2>
        <table className="min-w-[420px] w-full text-left">
          <thead className="border-b border-crow-line text-xs uppercase tracking-[0.2em] text-crow-muted">
            <tr>
              <th className="p-3">Location</th>
              <th className="p-3">Score</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentHistory.length === 0 ? (
              <tr>
                <td className="p-3 text-crow-muted" colSpan="3">No recorded heists yet.</td>
              </tr>
            ) : (
              recentHistory.map((row) => (
                <tr key={row.id} className="border-b border-crow-line">
                  <td className="p-3">{row.location}</td>
                  <td className="p-3">{row.score}</td>
                  <td className="p-3">{formatDate(row.date)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </AppLayout>
  );
}
