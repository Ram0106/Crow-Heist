import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
        <div className="sharp-panel p-6 text-crow-muted">No result data available.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="sharp-panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-crow-muted">Result</p>
          <h1 className={`location-font mt-3 text-6xl ${breakdown.success ? 'text-crow-gold' : 'text-crow-red'}`}>
            {breakdown.success ? 'Successful Lift' : 'Wings Clipped'}
          </h1>

          <div className="mt-8 grid gap-4">
            <ScoreRow label="Base Score" value={breakdown.baseScore} />
            <ScoreRow label="Time Bonus" value={`${breakdown.timeBonusMultiplier}x`} plain />
            <ScoreRow label="Decoy Penalty" value={`${breakdown.decoyPenaltyPercent}%`} plain />
            <ScoreRow label="Final Score" value={breakdown.score} large />
          </div>
        </section>

        <section className="sharp-panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-crow-muted">Nest Update</p>
          <h2 className="location-font mt-3 text-4xl text-white">Newly Claimed</h2>
          <div className="mt-6">
            <NestGrid items={newItems.length > 0 ? newItems : nestItems.slice(-4)} animated />
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate(`/heist/${levelNumber}`)}
          className="border border-crow-line px-5 py-3 uppercase tracking-[0.2em] text-white hover:border-crow-gold"
        >
          Retry
        </button>
        {canPlayNextLevel ? (
          <button
            type="button"
            onClick={() => navigate(`/heist/${nextLevelNumber}`)}
            className="border border-crow-gold px-5 py-3 uppercase tracking-[0.2em] text-crow-gold hover:bg-crow-gold hover:text-black"
          >
            Next Level
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="border border-crow-line px-5 py-3 uppercase tracking-[0.2em] text-crow-muted hover:text-white"
        >
          Home
        </button>
      </div>
    </AppLayout>
  );
}

function ScoreRow({ label, value, large, plain }) {
  return (
    <div className="flex items-center justify-between border-b border-crow-line py-3">
      <span className="text-sm uppercase tracking-[0.2em] text-crow-muted">{label}</span>
      <span className={`${large ? 'text-4xl' : 'text-2xl'} font-semibold text-crow-gold`}>
        {plain ? value : <CountUp value={value} />}
      </span>
    </div>
  );
}
