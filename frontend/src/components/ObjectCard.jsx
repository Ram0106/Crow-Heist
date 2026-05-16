import { motion } from 'framer-motion';

export default function ObjectCard({ object, selected, onToggle }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      onClick={() => onToggle(object)}
      className={`min-h-40 border bg-crow-panel p-4 text-left transition ${
        selected ? 'animate-pulseGold border-crow-gold' : 'border-crow-line hover:border-crow-gold'
      }`}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-crow-muted">Object</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{object.name}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-crow-muted">Value</p>
            <p className="text-crow-gold">{object.value}</p>
          </div>
          <div>
            <p className="text-crow-muted">Weight</p>
            <p className="text-white">{object.weight}</p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
