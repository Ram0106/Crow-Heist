import { motion } from 'framer-motion';
import { getSelectedTotals } from '../utils/heistMath';

export default function HeistTopBar({ level, selectedObjects, elapsedTime, timerStarted, onSubmit }) {
  const totals = getSelectedTotals(selectedObjects);
  const overLimit = totals.weight > level.carry_limit;
  const progress = timerStarted
    ? Math.max(0, 100 - (elapsedTime / level.time_limit_seconds) * 100)
    : 100;
  const isLowTime = progress < 25;

  return (
    <div className="sharp-panel sticky top-0 z-10 mb-5 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto] xl:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-crow-muted">Location</p>
          <h1 className="location-font text-3xl font-bold text-white">{level.location_name}</h1>
        </div>
        <Counter label="Carry" value={`${totals.weight}/${level.carry_limit}`} danger={overLimit} />
        <Counter label="Value" value={totals.value} />
        <Counter label="Time" value={`${elapsedTime}s`} isLowTime={isLowTime} />
        <motion.button
          type="button"
          onClick={onSubmit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border border-crow-gold px-5 py-3 text-sm uppercase tracking-[0.2em] text-crow-gold hover:bg-crow-gold hover:text-black xl:justify-self-end"
        >
          Submit
        </motion.button>
      </div>
      <div className="mt-4 h-1 bg-crow-line">
        <motion.div
          className={`h-full ${isLowTime ? 'bg-crow-red' : 'bg-crow-gold'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.25, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

function Counter({ label, value, danger, isLowTime }) {
  return (
    <motion.div
      animate={danger ? { x: [0, -3, 3, -3, 3, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={`border p-3 ${danger ? 'border-crow-red text-crow-red' : 'border-crow-line text-white'}`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-crow-muted">{label}</p>
      <motion.p
        className="mt-1 text-xl font-semibold"
        key={value}
        initial={{ scale: 1.2, color: '#c9a945' }}
        animate={{ scale: 1, color: danger ? '#ef4444' : 'inherit' }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.p>
    </motion.div>
  );
}
