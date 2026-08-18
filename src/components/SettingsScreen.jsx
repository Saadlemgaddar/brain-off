import { useGame } from '../context/GameContext'
import { LANGUAGES, UI_TEXT } from '../utils/i18n'

export default function SettingsScreen() {
  const { state, dispatch } = useGame()
  const t = UI_TEXT[state.language || 'fr']

  return (
    <div className="screen screen-pad fade-in" style={{ overflowY: 'auto' }}>
      <div className="row" style={{ marginBottom: 24 }}>
        <button className="btn-ghost" style={{ fontSize: 20, padding: 6 }} onClick={() => dispatch({ type: 'GO_HOME' })}>
          ←
        </button>
        <h2 style={{ fontSize: 20, marginLeft: 8 }}>{t.settingsTitle}</h2>
      </div>

      <div className="col" style={{ gap: 10, marginBottom: 28 }}>
        <p style={{ fontSize: 12, color: 'var(--ink-dim)', fontWeight: 600, letterSpacing: '0.04em' }}>
          {t.language}
        </p>
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            onClick={() => dispatch({ type: 'SET_LANGUAGE', value: l.code })}
            className="btn row"
            style={{
              justifyContent: 'flex-start',
              gap: 12,
              background: state.language === l.code ? 'var(--acid)' : 'var(--surface)',
              color: state.language === l.code ? 'var(--void)' : 'var(--ink)',
              padding: 16,
            }}
          >
            <span style={{ fontSize: 20 }}>{l.flag}</span> {l.label}
          </button>
        ))}
      </div>

      <div className="col" style={{ gap: 10 }}>
        <p style={{ fontSize: 12, color: 'var(--ink-dim)', fontWeight: 600, letterSpacing: '0.04em' }}>
          {t.gameMode}
        </p>
        <button
          onClick={() => dispatch({ type: 'SET_ALCOHOL_MODE', value: true })}
          className="btn"
          style={{
            textAlign: 'left',
            background: 'var(--surface)',
            border: `2px solid ${state.alcoholMode === true ? 'var(--drunk)' : 'transparent'}`,
            padding: 18,
          }}
        >
          <div style={{ fontSize: 16, marginBottom: 3 }}>{t.withAlcohol}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-dim)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
            {t.withAlcoholDesc}
          </div>
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_ALCOHOL_MODE', value: false })}
          className="btn"
          style={{
            textAlign: 'left',
            background: 'var(--surface)',
            border: `2px solid ${state.alcoholMode === false ? 'var(--acid)' : 'transparent'}`,
            padding: 18,
          }}
        >
          <div style={{ fontSize: 16, marginBottom: 3 }}>{t.noAlcohol}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-dim)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
            {t.noAlcoholDesc}
          </div>
        </button>
      </div>

      <div className="grow" />

      <button
        onClick={() => dispatch({ type: 'SET_VOICE_TOGGLE', value: !state.voiceEnabled })}
        className="btn btn-ghost"
        style={{ marginTop: 20 }}
      >
        {state.voiceEnabled ? t.voiceOn : t.voiceOff}
      </button>
    </div>
  )
}
