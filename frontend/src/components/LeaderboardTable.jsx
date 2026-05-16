export default function LeaderboardTable({ rows, currentPlayerId }) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-crow-line text-xs uppercase tracking-[0.2em] text-crow-muted">
          <th className="p-3">Rank</th>
          <th className="p-3">Username</th>
          <th className="p-3">Score</th>
          <th className="p-3">Levels Completed</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const player = row.player || {};
          const isCurrent = String(player._id) === String(currentPlayerId);
          return (
            <tr
              key={`${row.rank}-${player._id || player.username}`}
              className={`border-b border-crow-line ${isCurrent ? 'bg-crow-gold/10 text-crow-gold' : 'text-white'}`}
            >
              <td className="p-3">{row.rank}</td>
              <td className="p-3">{player.username || 'Unknown'}</td>
              <td className="p-3">{row.score ?? player.total_score ?? 0}</td>
              <td className="p-3">{Math.max(0, (player.current_level || 1) - 1)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
