import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import LeaderboardTable from '../components/LeaderboardTable';
import { getDailyLeaderboard, getGlobalLeaderboard } from '../api/leaderboard';
import { useRequirePlayer } from '../hooks/useRequirePlayer';

export default function Leaderboard() {
  const playerId = useRequirePlayer();
  const [tab, setTab] = useState('today');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loader = tab === 'today' ? getDailyLeaderboard : getGlobalLeaderboard;
    loader()
      .then((response) => setRows(response.data.leaderboard))
      .catch((requestError) => setError(requestError.message));
  }, [tab]);

  return (
    <AppLayout>
      <PageHeader eyebrow="Ranks" title="Leaderboard" />

      <div className="mb-5 flex gap-3">
        <TabButton active={tab === 'today'} onClick={() => setTab('today')}>Today</TabButton>
        <TabButton active={tab === 'all'} onClick={() => setTab('all')}>All Time</TabButton>
      </div>

      {error ? <p className="mb-4 text-crow-red">{error}</p> : null}

      <section className="sharp-panel p-5">
        <LeaderboardTable rows={rows} currentPlayerId={playerId} />
      </section>
    </AppLayout>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-5 py-3 uppercase tracking-[0.2em] ${
        active ? 'border-crow-gold text-crow-gold' : 'border-crow-line text-crow-muted hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
