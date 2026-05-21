import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { usePlayerStore } from '../store/playerStore';

const navItems = [
  { to: '/home', label: 'Command', icon: '◆' },
  { to: '/levels', label: 'Operations', icon: '◈' },
  { to: '/daily', label: 'Daily Heist', icon: '◇' },
  { to: '/achievements', label: 'Vault', icon: '◇' },
  { to: '/collection', label: 'Loot', icon: '◆' },
  { to: '/leaderboard', label: 'Rivals', icon: '◆' },
];

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const { username, total_score, current_level, xp_points, daily_streak, clearPlayer } = usePlayerStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function logout() {
    clearPlayer();
    navigate('/');
  }

  const xpProgress = Math.min((xp_points || 0) / 1000, 1) * 100;

  return (
    <div className="flex min-h-screen bg-cyber-bg">
      {/* Cyber Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full bg-cyber-card border-r border-cyber-border transition-all duration-300 ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Logo Area */}
        <div className="flex h-20 items-center justify-between border-b border-cyber-border px-5">
          {sidebarOpen ? (
            <div>
              <h1 className="text-xl font-bold tracking-wider text-accent-primary uppercase">
                CROW<span className="text-accent-gold">HEIST</span>
              </h1>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-text-muted">
                Command Center v2.0
              </p>
            </div>
          ) : (
            <span className="text-2xl text-accent-primary">◇</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-text-muted hover:text-accent-primary transition-colors"
          >
            <span className="text-xl">{sidebarOpen ? '◀' : '▶'}</span>
          </button>
        </div>

        {/* Operator Profile */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-cyber-border p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-gold/20 border border-accent-primary/30">
                <span className="text-xl text-accent-primary font-bold">
                  {(username || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {username || 'Unknown'}
                </p>
                <p className="text-xs text-text-muted uppercase tracking-wider">
                  Level {current_level || 1}
                </p>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-text-muted uppercase tracking-wider">XP</span>
                <span className="text-accent-primary font-medium">{xp_points || 0} / 1000</span>
              </div>
              <div className="h-1.5 bg-cyber-line rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-gold rounded-full"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <StatMini label="Score" value={total_score || 0} />
              <StatMini label="Streak" value={daily_streak || 0} />
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-primary/10 text-accent-primary border-l-2 border-accent-primary glow-border'
                    : 'text-text-muted hover:text-text-primary hover:bg-cyber-panel border-l-2 border-transparent'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyber-border">
          <button
            type="button"
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium uppercase tracking-wider text-text-muted hover:text-accent-danger hover:bg-accent-danger/10 transition-all duration-200 border border-transparent hover:border-accent-danger/30 ${
              sidebarOpen ? '' : 'justify-center'
            }`}
          >
            <span className="text-lg">◇</span>
            {sidebarOpen && <span>Abort Mission</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-cyber-bg/80 backdrop-blur-xl border-b border-cyber-border">
          <div className="flex h-full items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-primary animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-text-muted">
                System Online • Secure Connection
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-text-muted">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <div className="h-6 w-px bg-cyber-border" />
              <span className="text-accent-primary text-sm font-medium uppercase tracking-wider">
                Active Ops
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function StatMini({ label, value }) {
  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-accent-gold">{value?.toLocaleString()}</p>
    </div>
  );
}