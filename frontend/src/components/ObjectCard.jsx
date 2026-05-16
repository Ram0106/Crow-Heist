import { motion } from 'framer-motion';

export default function ObjectCard({ object, selected, onToggle }) {
  const isDecoy = object.is_decoy;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(201, 169, 69, 0.3)' }}
      whileTap={{ scale: 0.95 }}
      animate={selected ? {
        scale: [1, 1.08, 1],
        boxShadow: ['0 0 0px rgba(201, 169, 69, 0)', '0 0 25px rgba(201, 169, 69, 0.6)', '0 0 10px rgba(201, 169, 69, 0.3)']
      } : { scale: 1, boxShadow: '0 0 0px rgba(201, 169, 69, 0)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      onClick={() => onToggle(object)}
      className={`relative min-h-40 cursor-pointer border bg-crow-panel p-4 text-left transition ${
        selected
          ? 'border-crow-gold'
          : isDecoy
          ? 'border-crow-red/50 hover:border-crow-red'
          : 'border-crow-line hover:border-crow-gold'
      }`}
    >
      {isDecoy && (
        <motion.div
          className="absolute right-2 top-2 text-xs text-crow-red opacity-60"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          DECOY
        </motion.div>
      )}

      <div className="flex h-full flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-crow-muted">Object</p>
          <h3 className={`mt-2 text-lg font-semibold ${isDecoy ? 'text-crow-red/80' : 'text-white'}`}>
            {object.name}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-crow-muted">Value</p>
            <p className={isDecoy ? 'text-crow-red/60' : 'text-crow-gold'}>{object.value}</p>
          </div>
          <div>
            <p className="text-crow-muted">Weight</p>
            <p className={isDecoy ? 'text-crow-red/60' : 'text-white'}>{object.weight}</p>
          </div>
        </div>
      </div>

      {selected && (
        <motion.div
          className="absolute inset-0 border-2 border-crow-gold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.button>
  );
}
