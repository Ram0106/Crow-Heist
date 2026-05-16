import { NavLink, useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';

const navItems = [
  { to: '/home', label: 'Nest' },
  { to: '/levels', label: 'Levels' },
  { to: '/daily', label: 'Daily Heist' },
  { to: '/leaderboard', label: 'Leaderboard' }
];

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const { username, total_score, current_level, unlocked_levels, daily_streak, clearPlayer } = usePlayerStore();
  const displayedLevel = unlocked_levels.length > 0
    ? Math.min(current_level, Math.max(...unlocked_levels))
    : current_level;

  function logout() {
    clearPlayer();
    navigate('/');
  }

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-[1100px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-6 lg:py-8">
      <aside className="sharp-panel p-5 lg:sticky lg:top-8 lg:h-[calc(100vh-64px)]">
        <div className="border-b border-crow-line pb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-crow-muted">Operator</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{username || 'Unknown'}</h2>
        </div>

        <div className="mt-6 grid gap-3 text-sm">
          <SidebarStat label="Total Score" value={total_score} />
          <SidebarStat label="Current Level" value={displayedLevel} />
          <SidebarStat label="Daily Streak" value={daily_streak} />
        </div>

        <nav className="mt-8 grid gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `border border-crow-line px-4 py-3 text-sm uppercase tracking-[0.16em] transition ${
                  isActive ? 'border-crow-gold text-crow-gold' : 'text-crow-muted hover:border-crow-gold hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={logout}
          className="mt-8 w-full border border-crow-line px-4 py-3 text-left text-sm uppercase tracking-[0.16em] text-crow-muted hover:border-crow-red hover:text-crow-red"
        >
          Abandon Roost
        </button>
      </aside>

      <main className="min-w-0 pb-8">{children}</main>
    </div>
  );
}

function SidebarStat({ label, value }) {
  return (
    <div className="border border-crow-line bg-black/30 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-crow-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold text-crow-gold">{value}</p>
    </div>
  );
}
