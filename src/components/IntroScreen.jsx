import { useGame } from '../context/GameContext'
import { LANGUAGES, UI_TEXT } from '../utils/i18n'

export default function IntroScreen() {
  const { dispatch } = useGame()

  function chooseLanguage(code) {
    dispatch({ type: 'SET_LANGUAGE_FROM_INTRO', value: code })
  }

  return (
    <div className="screen screen-pad fade-in center" style={{ background: 'radial-gradient(ellipse at top, #1C1C2B 0%, #0B0B14 60%)' }}>
      <div className="col center" style={{ gap: 28, width: '100%' }}>
        <div style={{ fontSize: 44 }}>🌍</div>
        <h2 style={{ fontSize: 22, textAlign: 'center' }}>
          {UI_TEXT.fr.languageChoiceTitle} / Choose your language
        </h2>
        <div className="col" style={{ gap: 12, width: '100%', maxWidth: 320 }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => chooseLanguage(l.code)}
              className="btn"
              style={{
                background: 'var(--surface)',
                fontSize: 17,
                padding: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 22 }}>{l.flag}</span> {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
