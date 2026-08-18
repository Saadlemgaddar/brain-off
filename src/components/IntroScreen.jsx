import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { LANGUAGES, UI_TEXT } from '../utils/i18n'
import { speak } from '../utils/voice'

export default function IntroScreen() {
  const { dispatch } = useGame()
  const [step, setStep] = useState('language') // language | mode
  const [language, setLanguage] = useState('fr')

  const t = UI_TEXT[language]

  function chooseLanguage(code) {
    setLanguage(code)
    setStep('mode')
  }

  function chooseMode(alcoholMode) {
    dispatch({ type: 'SET_INTRO_CHOICES', language, alcoholMode })
    // Petit message vocal de bienvenue pour confirmer que la voix marche, dans la langue choisie
    setTimeout(() => {
      speak(UI_TEXT[language].appName, language)
    }, 300)
  }

  if (step === 'language') {
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

        <button
          onClick={() => setStep('language')}
          style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 8 }}
        >
          ← {t.back}
        </button>
      </div>
    </div>
  )
}
