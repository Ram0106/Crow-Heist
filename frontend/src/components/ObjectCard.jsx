import { motion } from 'framer-motion';

export default function ObjectCard({ object, selected, onToggle, hintsEnabled }) {
  const isDecoy = object.is_decoy;

  const ratio = object.weight > 0 ? object.value / object.weight : 0;
  const maxRatio = 10;
  const normalizedRatio = Math.min(ratio / maxRatio, 1);

  const hintGlow = hintsEnabled && !isDecoy
    ? `0 0 ${Math.round(normalizedRatio * 20)}px rgba(0, 255, 209, ${normalizedRatio * 0.5})`
    : '0 0 0px rgba(0, 255, 209, 0)';

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0, 255, 209, 0.25)' }}
      whileTap={{ scale: 0.95 }}
      animate={selected ? {
        scale: [1, 1.08, 1],
        boxShadow: ['0 0 0px rgba(255, 200, 87, 0)', '0 0 30px rgba(255, 200, 87, 0.6)', '0 0 15px rgba(255, 200, 87, 0.3)']
      } : { scale: 1, boxShadow: hintGlow }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      onClick={() => onToggle(object)}
      className={`relative min-h-40 cursor-pointer rounded-xl border bg-cyber-panel p-4 text-left transition-all duration-300 ${
        selected
          ? 'border-accent-gold shadow-[0_0_25px_rgba(255,200,87,0.3)]'
          : isDecoy
            ? 'border-accent-danger/40 hover:border-accent-danger'
            : 'border-cyber-border hover:border-accent-primary'
      }`}
    >
      {/* Hint Overlay */}
      {hintsEnabled && !isDecoy && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-accent-primary/10 to-transparent"
          style={{ opacity: normalizedRatio * 0.5 }}
        />
      )}

      {/* Decoy Indicator */}
      {isDecoy && (
        <motion.div
          className="absolute right-3 top-3 rounded-md bg-accent-danger/20 border border-accent-danger/40 px-2 py-1 text-[10px] uppercase tracking-wider text-accent-danger font-bold"
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ⚠ Decoy
        </motion.div>
      )}

      {/* Selected Border Effect */}
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-accent-gold"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Content */}
      <div className="flex h-full flex-col justify-between">
        {/* Header */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${isDecoy ? 'bg-accent-danger' : 'bg-accent-primary'}`} />
            {isDecoy ? 'Threat' : 'Target'}
          </p>
          <h3 className={`mt-2 text-lg font-semibold uppercase tracking-wider ${
            isDecoy ? 'text-accent-danger/70' : 'text-text-primary'
          }`}>
            {object.name}
          </h3>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className={`rounded-lg p-2.5 ${isDecoy ? 'bg-accent-danger/5' : 'bg-cyber-line/50'}`}>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Value</p>
            <p className={`text-lg font-bold mt-1 ${isDecoy ? 'text-accent-danger/50' : 'text-accent-gold'}`}>
              {object.value}
            </p>
          </div>
          <div className={`rounded-lg p-2.5 ${isDecoy ? 'bg-accent-danger/5' : 'bg-cyber-line/50'}`}>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Weight</p>
            <p className={`text-lg font-bold mt-1 ${isDecoy ? 'text-accent-danger/50' : 'text-text-primary'}`}>
              {object.weight}
            </p>
          </div>
        </div>

        {/* Efficiency Bar (when hints enabled) */}
        {hintsEnabled && !isDecoy && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-text-muted uppercase tracking-wider">Efficiency</span>
              <span className="text-accent-primary font-medium">
                {(ratio).toFixed(1)} V/W
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-cyber-line overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-gold"
                initial={{ width: 0 }}
                animate={{ width: `${normalizedRatio * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      <motion.div
        className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-gold text-cyber-bg text-xs font-bold"
        initial={{ scale: 0 }}
        animate={{ scale: selected ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 500 }}
      >
        ✓
      </motion.div>
    </motion.button>
  );
}