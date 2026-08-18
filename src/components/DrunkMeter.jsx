import { useGame } from '../context/GameContext'

const STAGE_COLORS = {
  sober: 'var(--acid)',
  tipsy: 'var(--tipsy)',
  drunk: 'var(--drunk)',
  wasted: 'var(--wasted)',
  final: 'var(--final)',
}

export default function DrunkMeter({ compact = false }) {
  const { drunkPct, drunkStage, state } = useGame()

  if (!state.drunkModeEnabled) return null

  const color = STAGE_COLORS[drunkStage.key]

  if (compact) {
    return (
      <div className="row" style={{ gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 18 }}>{drunkStage.emoji}</span>
        <div style={{ width: 70 }} className="meter-track">
          <div
            className="meter-fill"
            style={{ width: `${drunkPct}%`, background: color }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="col" style={{ gap: 6, width: '100%' }}>
      <div className="row spread">
        <span style={{ fontSize: 12, color: 'var(--ink-dim)', fontFamily: 'var(--font-body)', fontWeight: 600, letterSpacing: '0.05em' }}>
          {drunkStage.emoji} {drunkStage.label}
        </span>
        <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{drunkPct}%</span>
      </div>
      <div className="meter-track">
        <div
          className="meter-fill"
          style={{ width: `${drunkPct}%`, background: color }}
        />
      </div>
    </div>
  )
}
