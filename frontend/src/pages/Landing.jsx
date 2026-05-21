import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerPlayer } from '../api/player';
import { usePlayerStore } from '../store/playerStore';

export default function Landing() {
  const navigate = useNavigate();
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await registerPlayer(username);
      setPlayer(response.data.player);
      navigate('/home');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cyber-bg">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern" />

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-accent-primary/5 via-transparent to-transparent" />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-accent-primary/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-accent-gold/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Scan Line Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent animate-scan-line" />
      </div>

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        {/* Logo Mark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-accent-primary bg-accent-primary/10 animate-pulse-glow">
              <span className="text-4xl text-accent-primary">◇</span>
            </div>
            <div className="absolute -inset-4 rounded-2xl border border-accent-primary/20" />
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-3 text-center text-xs uppercase tracking-[0.4em] text-accent-primary"
        >
          Secure Access Portal
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="text-center text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="text-text-primary">CROW</span>
          <span className="text-gradient-gold">HEIST</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-center text-sm uppercase tracking-[0.2em] text-text-muted"
        >
          Plan. Execute. Dominate.
        </motion.p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onSubmit={handleSubmit}
          className="mt-12 space-y-4"
        >
          {/* Username Input */}
          <div className="relative">
            <motion.div
              animate={{
                borderColor: focused ? '#00FFD1' : '#1E2738',
                boxShadow: focused ? '0 0 20px rgba(0, 255, 209, 0.15)' : 'none',
              }}
              className="rounded-xl border bg-cyber-card transition-all duration-300"
            >
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Enter callsign"
                className="w-full border-none bg-transparent px-5 py-4 text-center text-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-0"
                autoComplete="off"
                spellCheck="false"
              />
            </motion.div>

            {/* Input glow line */}
            <motion.div
              className="absolute bottom-0 left-1/2 h-px -translate-x-1/2 bg-gradient-to-r from-transparent via-accent-primary to-transparent"
              initial={{ width: 0 }}
              animate={{ width: focused ? '80%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || !username.trim()}
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0, 255, 209, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="btn-cyber w-full py-4 text-sm uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:box-shadow-none"
          >
            <span>{loading ? 'Authenticating...' : 'Initialize Operative'}</span>
          </motion.button>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-accent-danger"
            >
              {error}
            </motion.p>
          )}
        </motion.form>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex items-center justify-center gap-8"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-primary">∞</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-text-muted">
              Operations
            </p>
          </div>
          <div className="h-8 w-px bg-cyber-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-gold">24/7</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-text-muted">
              Secure Access
            </p>
          </div>
          <div className="h-8 w-px bg-cyber-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-purple">0</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-text-muted">
              Detected
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Version */}
      <div className="absolute bottom-6 text-[10px] uppercase tracking-widest text-text-dim">
        v2.0 • Secure Terminal
      </div>
    </main>
  );
}