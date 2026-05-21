import { motion } from 'framer-motion';

export default function NestGrid({ items = [], animated = false }) {
  if (items.length === 0) {
    return (
      <div className="cyber-card p-8 text-center">
        <div className="mb-4 text-5xl text-text-dim animate-float">◇</div>
        <p className="text-sm text-text-muted uppercase tracking-wider">
          Vault Empty — Something valuable awaits.
        </p>
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
          whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(255, 200, 87, 0.2)', borderColor: 'rgba(255, 200, 87, 0.5)' }}
          transition={{
            delay: animated ? index * 0.08 : 0,
            type: 'spring',
            stiffness: 350,
            damping: 15,
            y: { duration: 0.5, delay: animated ? index * 0.08 + 0.3 : 0.3 }
          }}
          className="cursor-pointer rounded-xl border border-cyber-border bg-cyber-panel p-4 transition-all duration-300"
        >
          <motion.div
            className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-accent-gold/40 bg-accent-gold/10"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <span className="text-accent-gold text-xl">◆</span>
          </motion.div>

          <p className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            {item.name}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Value: <span className="text-accent-gold font-medium">{item.value}</span>
          </p>
          {item.rarity && (
            <div className={`mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider ${
              item.rarity === 'legendary'
                ? 'text-accent-gold bg-accent-gold/10 border border-accent-gold/30'
                : item.rarity === 'epic'
                  ? 'text-accent-purple bg-accent-purple/10 border border-accent-purple/30'
                  : 'text-accent-primary bg-accent-primary/10 border border-accent-primary/30'
            }`}>
              <span className="h-1 w-1 rounded-full bg-current" />
              {item.rarity}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}