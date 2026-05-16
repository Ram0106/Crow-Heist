import { motion } from 'framer-motion';

export default function NestGrid({ items = [], animated = false }) {
  if (items.length === 0) {
    return (
      <div className="sharp-panel p-6 text-sm text-crow-muted">
        The nest is empty. Somewhere, something expensive waits unattended.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={`${item.name}-${index}`}
          initial={animated ? { opacity: 0, y: -18 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: animated ? index * 0.1 : 0 }}
          className="border border-crow-line bg-crow-panel p-3"
        >
          <div className="mb-3 h-8 w-8 border border-crow-gold text-center leading-8 text-crow-gold">&diams;</div>
          <p className="text-sm font-semibold text-white">{item.name}</p>
          <p className="mt-1 text-xs text-crow-muted">Value {item.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
