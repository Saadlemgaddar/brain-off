import { useGame } from '../context/GameContext'
import { UI_TEXT } from '../utils/i18n'

export default function HomeScreen() {
  const { dispatch, state } = useGame()
  const t = UI_TEXT[state.language || 'fr']

  return (
    <div className="screen screen-pad fade-in" style={{ background: 'radial-gradient(ellipse at top, #1C1C2B 0%, #0B0B14 60%)' }}>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button
          onClick={() => dispatch({ type: 'SET_VOICE_TOGGLE', value: !state.voiceEnabled })}
          style={{
            fontSize: 12,
            color: 'var(--ink-faint)',
            background: 'var(--surface)',
            padding: '8px 14px',
            borderRadius: 999,
          }}
        >
          {state.voiceEnabled ? t.voiceOn : t.voiceOff}
        </button>
      </div>

      <div className="col grow center" style={{ gap: 8 }}>
        <div style={{ fontSize: 52, marginBottom: 4 }}>🧠🥴</div>
        <h1 style={{ fontSize: 40, color: 'var(--ink)', textAlign: 'center', lineHeight: 1 }}>
          BRAIN<br />
          <span style={{ color: 'var(--acid)' }}>OFF</span>
        </h1>
        <p style={{ color: 'var(--ink-dim)', fontSize: 14, marginTop: 10, letterSpacing: '0.02em' }}>
          {t.tagline}
        </p>
      </div>

      <div className="col" style={{ gap: 12, paddingBottom: 12 }}>
        <button className="btn btn-primary" onClick={() => dispatch({ type: 'GO_SETUP', mode: 'party' })}>
          {t.partyMode}
        </button>
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_SETUP', mode: 'solo' })}>
          {t.soloMode}
        </button>
        <p style={{ color: 'var(--ink-faint)', fontSize: 11, textAlign: 'center', marginTop: 6, lineHeight: 1.5 }}>
          {t.subtitle}
        </p>
      </div>
    </div>
  )
}
