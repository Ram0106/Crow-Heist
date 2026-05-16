import { getSelectedTotals } from '../utils/heistMath';

export default function HeistTopBar({ level, selectedObjects, elapsedTime, timerStarted, onSubmit }) {
  const totals = getSelectedTotals(selectedObjects);
  const overLimit = totals.weight > level.carry_limit;
  const progress = timerStarted
    ? Math.max(0, 100 - (elapsedTime / level.time_limit_seconds) * 100)
    : 100;

  return (
    <div className="sharp-panel sticky top-0 z-10 mb-5 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto] xl:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-crow-muted">Location</p>
          <h1 className="location-font text-3xl font-bold text-white">{level.location_name}</h1>
        </div>
        <Counter label="Carry" value={`${totals.weight}/${level.carry_limit}`} danger={overLimit} />
        <Counter label="Value" value={totals.value} />
        <Counter label="Time" value={`${elapsedTime}s`} />
        <button
          type="button"
          onClick={onSubmit}
          className="border border-crow-gold px-5 py-3 text-sm uppercase tracking-[0.2em] text-crow-gold hover:bg-crow-gold hover:text-black xl:justify-self-end"
        >
          Submit
        </button>
      </div>
      <div className="mt-4 h-1 bg-crow-line">
        <div
          className="h-full bg-crow-gold transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Counter({ label, value, danger }) {
  return (
    <div className={`border p-3 ${danger ? 'border-crow-red text-crow-red' : 'border-crow-line text-white'}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-crow-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
