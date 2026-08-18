import { useGame } from '../context/GameContext'
import { UI_TEXT } from '../utils/i18n'

export default function ResponsibleDrinkingScreen() {
  const { state, dispatch } = useGame()
  const t = UI_TEXT[state.language || 'fr']

  function acknowledge() {
    dispatch({ type: 'ACK_RESPONSIBLE_DRINKING' })
  }

  return (
    <div className="screen screen-pad fade-in center" style={{ background: 'radial-gradient(ellipse at top, #1C1C2B 0%, #0B0B14 60%)' }}>
      <div className="col center" style={{ gap: 20, width: '100%', maxWidth: 360 }}>
        <div style={{ fontSize: 44 }}>⚠️</div>
        <h2 style={{ fontSize: 20, textAlign: 'center' }}>{t.responsibleDrinkingTitle}</h2>
        <p style={{ fontSize: 14, color: 'var(--ink-dim)', textAlign: 'center', lineHeight: 1.6 }}>
          {t.responsibleDrinkingBody}
        </p>

        <button
          onClick={acknowledge}
          className="btn btn-primary"
          style={{ padding: 18, width: '100%', marginTop: 8 }}
        >
          {t.responsibleDrinkingButton}
        </button>
      </div>
    </div>
  )
}
