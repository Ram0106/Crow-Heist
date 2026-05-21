import { motion } from 'framer-motion';
import { getSelectedTotals } from '../utils/heistMath';

export default function HeistTopBar({ level, selectedObjects, elapsedTime, timerStarted, onSubmit, hintsEnabled, onToggleHints }) {
  const totals = getSelectedTotals(selectedObjects);
  const overLimit = totals.weight > level.carry_limit;
  const progress = timerStarted
    ? Math.max(0, 100 - (elapsedTime / level.time_limit_seconds) * 100)
    : 100;
  const isLowTime = progress < 25;

  return (
    <div className="cyber-card sticky top-0 z-10 mb-5 p-4 border border-accent-primary/20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_auto_auto] xl:items-center">
        {/* Location */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-accent-primary flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
            Active Target
          </p>
          <h1 className="text-3xl font-bold text-text-primary uppercase tracking-wider mt-1">
            {level.location_name}
          </h1>
        </div>

        {/* Carry Counter */}
        <Counter
          label="Payload"
          value={`${totals.weight}/${level.carry_limit}`}
          danger={overLimit}
          icon="◆"
        />

        {/* Value Counter */}
        <Counter
          label="Est. Value"
          value={totals.value.toLocaleString()}
          color="text-accent-gold"
          icon="◇"
        />

        {/* Time Counter */}
        <Counter
          label="Time Elapsed"
          value={`${elapsedTime}s`}
          isLowTime={isLowTime}
          icon="◈"
        />

        {/* Actions */}
        <div className="flex gap-2 xl:justify-self-end">
          <motion.button
            type="button"
            onClick={onToggleHints}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 255, 209, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-3 text-sm uppercase tracking-[0.2em] font-medium rounded-lg border transition-all duration-200 ${
              hintsEnabled
                ? 'border-accent-primary bg-accent-primary/20 text-accent-primary glow-border'
                : 'border-cyber-border text-text-muted hover:border-accent-primary hover:text-accent-primary'
            }`}
            title="Toggle value hints"
          >
            <span className="flex items-center gap-2">
              <span className="text-xs">{hintsEnabled ? '◉' : '○'}</span>
              Intel
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={onSubmit}
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255, 200, 87, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="btn-gold px-5 py-3 text-sm uppercase tracking-[0.2em] font-medium"
          >
            <span>Extract</span>
          </motion.button>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="mt-4 h-1.5 bg-cyber-line rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isLowTime ? 'bg-accent-danger' : 'bg-gradient-to-r from-accent-primary to-accent-gold'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.25, ease: 'linear' }}
        >
          {timerStarted && (
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Counter({ label, value, danger, isLowTime, color, icon }) {
  return (
    <motion.div
      animate={danger ? { x: [0, -3, 3, -3, 3, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border p-3 ${
        danger
          ? 'border-accent-danger bg-accent-danger/10'
          : 'border-cyber-border bg-cyber-panel'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs ${danger ? 'text-accent-danger' : 'text-text-muted'}`}>
          {icon}
        </span>
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">{label}</p>
      </div>
      <motion.p
        className={`text-xl font-bold ${
          danger
            ? 'text-accent-danger'
            : isLowTime
              ? 'text-accent-gold'
              : color || 'text-text-primary'
        }`}
        key={value}
        initial={{ scale: 1.2, color: danger ? '#FF4D6D' : '#00FFD1' }}
        animate={{ scale: 1, color: 'inherit' }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.p>
    </motion.div>
  );
}