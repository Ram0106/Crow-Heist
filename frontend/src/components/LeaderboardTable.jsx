import { motion } from 'framer-motion';

export default function LeaderboardTable({ rows, currentPlayerId, compact = false }) {
  return (
    <div className={compact ? '' : 'overflow-hidden rounded-xl'}>
      <table className={`w-full ${compact ? '' : ''}`}>
        {!compact && (
          <thead>
            <tr className="border-b border-cyber-border text-xs uppercase tracking-[0.2em] text-text-muted">
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Operative</th>
              <th className="p-4 text-right">Score</th>
              <th className="p-4 text-right">Missions</th>
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, index) => {
            const player = row.player || {};
            const isCurrent = String(player._id) === String(currentPlayerId);
            const isTopThree = row.rank <= 3;

            return (
              <motion.tr
                key={`${row.rank}-${player._id || player.username}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-cyber-border/50 transition-all duration-200 ${
                  isCurrent
                    ? 'bg-accent-primary/10'
                    : 'hover:bg-cyber-panel'
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {row.rank === 1 && <span className="text-lg">👑</span>}
                    {row.rank === 2 && <span className="text-lg">🥈</span>}
                    {row.rank === 3 && <span className="text-lg">🥉</span>}
                    {row.rank > 3 && !compact && (
                      <span className="h-6 w-6 flex items-center justify-center rounded bg-cyber-panel text-xs text-text-muted">
                        {row.rank}
                      </span>
                    )}
                    {compact && (
                      <span className={`font-bold ${
                        row.rank === 1 ? 'text-accent-gold' :
                        row.rank === 2 ? 'text-gray-400' :
                        row.rank === 3 ? 'text-amber-600' :
                        'text-text-muted'
                      }`}>
                        #{row.rank}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                      isTopThree
                        ? row.rank === 1
                          ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/40'
                          : row.rank === 2
                            ? 'bg-gray-400/20 text-gray-300 border border-gray-400/40'
                            : 'bg-amber-600/20 text-amber-600 border border-amber-600/40'
                        : 'bg-cyber-panel text-text-muted border border-cyber-border'
                    }`}>
                      {(player.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`font-medium ${isCurrent ? 'text-accent-primary' : 'text-text-primary'}`}>
                        {player.username || 'Unknown'}
                        {isCurrent && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider text-accent-primary">(You)</span>
                        )}
                      </p>
                      {!compact && (
                        <p className="text-xs text-text-muted">Level {player.current_level || 1}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className={`font-bold ${
                    isTopThree && !compact ? 'text-accent-gold text-lg' : 'text-text-primary'
                  }`}>
                    {(row.score ?? player.total_score ?? 0).toLocaleString()}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-text-muted">
                    {compact
                      ? `${Math.max(0, (player.current_level || 1) - 1)}`
                      : `${Math.max(0, (player.current_level || 1) - 1)} completed`
                    }
                  </span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}