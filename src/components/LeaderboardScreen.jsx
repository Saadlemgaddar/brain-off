import { useGame } from '../context/GameContext'

const MEDALS = ['🥇', '🥈', '🥉', '💀', '💀', '💀', '💀', '💀']

export default function LeaderboardScreen() {
  const { state, dispatch } = useGame()
  const sorted = [...state.players].sort((a, b) => b.score - a.score)

  return (
    <div className="screen screen-pad fade-in" style={{ overflowY: 'auto' }}>
      <div className="col center" style={{ gap: 4, marginBottom: 28, marginTop: 12 }}>
        <div style={{ fontSize: 44 }}>🏆</div>
        <h1 style={{ fontSize: 26, textAlign: 'center' }}>CLASSEMENT FINAL</h1>
        <p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>La soirée est terminée</p>
      </div>

      <div className="col" style={{ gap: 10 }}>
        {sorted.map((p, i) => (
          <div
            key={p.id}
            className="row spread pop-in"
            style={{
              background: i === 0 ? 'linear-gradient(90deg, rgba(212,255,63,0.15), var(--surface))' : 'var(--surface)',
              border: i === 0 ? '2px solid var(--acid)' : '2px solid transparent',
              borderRadius: 16,
              padding: '16px 18px',
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div className="row" style={{ gap: 12 }}>
              <span style={{ fontSize: 22 }}>{MEDALS[i] || '🍺'}</span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</span>
            </div>
            <span style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: i === 0 ? 'var(--acid)' : 'var(--ink)' }}>
              {p.score}
            </span>
          </div>
        ))}
      </div>

      <div className="grow" />

      <div className="col" style={{ gap: 12, paddingTop: 20 }}>
        <button className="btn btn-primary" onClick={() => dispatch({ type: 'RESTART_PARTY' })}>
          🔁 REJOUER (mêmes joueurs)
        </button>
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_HOME' })}>
          🏠 Menu principal
        </button>
      </div>
    </div>
  )
}
