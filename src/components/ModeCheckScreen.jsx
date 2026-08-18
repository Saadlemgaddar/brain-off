import { useGame } from '../context/GameContext'
import { UI_TEXT } from '../utils/i18n'
import { speak } from '../utils/voice'

export default function ModeCheckScreen() {
  const { state, dispatch } = useGame()
  const lang = state.language || 'fr'
  const t = UI_TEXT[lang]

  function chooseMode(alcoholMode) {
    dispatch({ type: 'SET_INTRO_MODE', alcoholMode })
    setTimeout(() => {
      speak(t.appName, lang)
    }, 300)
  }

  return (
    <div className="screen screen-pad fade-in center" style={{ background: 'radial-gradient(ellipse at top, #1C1C2B 0%, #0B0B14 60%)' }}>
      <div className="col center" style={{ gap: 24, width: '100%' }}>
        <div style={{ fontSize: 44 }}>🎮</div>
        <div className="col center" style={{ gap: 6 }}>
          <h2 style={{ fontSize: 22, textAlign: 'center' }}>{t.drinkChoiceTitle}</h2>
          <p style={{ fontSize: 13, color: 'var(--ink-dim)', textAlign: 'center' }}>{t.drinkChoiceSubtitle}</p>
        </div>

        <div className="col" style={{ gap: 14, width: '100%', maxWidth: 340 }}>
          <button
            onClick={() => chooseMode(true)}
            className="btn"
            style={{
              background: 'var(--surface)',
              border: '2px solid var(--drunk)',
              padding: 20,
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: 17, marginBottom: 4 }}>{t.withAlcohol}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-dim)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
              {t.withAlcoholDesc}
            </div>
          </button>

          <button
            onClick={() => chooseMode(false)}
            className="btn"
            style={{
              background: 'var(--surface)',
              border: '2px solid var(--acid)',
              padding: 20,
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: 17, marginBottom: 4 }}>{t.noAlcohol}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-dim)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
              {t.noAlcoholDesc}
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
