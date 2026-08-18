import { useGame } from '../context/GameContext'
import { UI_TEXT, VOICE_INTROS } from '../utils/i18n'
import { useEffect, useRef } from 'react'
import { speak } from '../utils/voice'

export default function ReadyScreen() {
  const { state, dispatch, currentPlayer, currentLevel } = useGame()
  const lang = state.language || 'fr'
  const t = UI_TEXT[lang]
  const spokenRef = useRef(false)

  useEffect(() => {
    spokenRef.current = false
  }, [state.currentLevelIndex])

  useEffect(() => {
    if (spokenRef.current || !state.voiceEnabled || !currentPlayer || !currentLevel) return
    spokenRef.current = true
    const introLine = VOICE_INTROS[lang]?.[currentLevel.type]
    if (!introLine) return
    const prefix = state.isTestMode ? '' : `${t.yourTurn} ${currentPlayer.name}. `
    speak(`${prefix}${introLine}`, lang)
  }, [state.currentLevelIndex, currentPlayer, currentLevel])

  if (!currentPlayer || !currentLevel) return null

  function handleReady(e) {
    e.stopPropagation()
    dispatch({ type: 'CONFIRM_READY' })
  }

  return (
    <div
      className="screen center fade-in"
      style={{ background: 'radial-gradient(ellipse at top, #1C1C2B 0%, #0B0B14 60%)' }}
      onClick={handleReady}
    >
      <div className="col center" style={{ gap: 18, padding: '0 32px' }}>
        {state.isTestMode ? (
          <p style={{ color: 'var(--ink-dim)', fontSize: 15, textAlign: 'center' }}>
            {t.testIntro}
          </p>
        ) : (
          <>
            <p style={{ color: 'var(--ink-dim)', fontSize: 14, letterSpacing: '0.05em' }}>
              {t.yourTurn}
            </p>
            <h1 className="pop-in" style={{ fontSize: 36, color: 'var(--acid)', textAlign: 'center' }}>
              {currentPlayer.name}
            </h1>
          </>
        )}
        <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginTop: 4, textAlign: 'center' }}>
          {currentLevel.title}
        </p>

        <button
          onClick={handleReady}
          className="btn btn-primary pop-in"
          style={{ marginTop: 24, padding: '20px 40px', fontSize: 18 }}
        >
          {t.readyButton}
        </button>
        <p style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 4 }}>
          {t.tapAnywhereReady}
        </p>
      </div>
    </div>
  )
}
