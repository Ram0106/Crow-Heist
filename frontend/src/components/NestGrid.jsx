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
          initial={animated ? { opacity: 0, scale: 0.3, rotate: -10 } : false}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
            y: [0, -8, 0]
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(201, 169, 69, 0.2)' }}
          transition={{
            delay: animated ? index * 0.08 : 0,
            type: 'spring',
            stiffness: 350,
            damping: 15,
            y: { duration: 0.5, delay: animated ? index * 0.08 + 0.3 : 0.3 }
          }}
          className="cursor-pointer border border-crow-line bg-crow-panel p-3"
        >
          <motion.div
            className="mb-3 flex h-10 w-10 items-center justify-center border border-crow-gold text-crow-gold"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            &diams;
          </motion.div>
          <p className="text-sm font-semibold text-white">{item.name}</p>
          <p className="mt-1 text-xs text-crow-muted">Value {item.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
