import { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'
import { UI_TEXT } from '../utils/i18n'
import { speak } from '../utils/voice'
import { getTestResultGif, SOUNDS } from '../utils/media'
import { playSound } from '../utils/sound'

export default function TestResultScreen() {
  const { state, dispatch } = useGame()
  const t = UI_TEXT[state.language || 'fr']
  const lang = state.language || 'fr'
  const spokenRef = useRef(false)
  const soundPlayedRef = useRef(false)

  const passed = !!state.testPassed
  const gifSrc = getTestResultGif(passed)

  // Verdict textuel selon le mode alcool/sans-alcool ET le résultat — 4 combinaisons possibles.
  const verdict = state.alcoholMode
    ? (passed ? t.testVerdictDrunkSuccess : t.testVerdictDrunkFail)
    : (passed ? t.testVerdictCleanSuccess : t.testVerdictCleanFail)

  useEffect(() => {
    if (soundPlayedRef.current) return
    soundPlayedRef.current = true
    playSound(passed ? SOUNDS.applause : SOUNDS.buzzer, { volume: 0.5 })
  }, [])

  useEffect(() => {
    if (spokenRef.current || !state.voiceEnabled) return
    spokenRef.current = true
    speak(verdict, lang)
  }, [])

  return (
    <div
      className="screen screen-pad fade-in center"
      style={{
        background: passed
          ? 'radial-gradient(circle at center, #123322 0%, #0B0B14 70%)'
          : 'radial-gradient(circle at center, #331222 0%, #0B0B14 70%)',
      }}
    >
      <div className="col center pop-in" style={{ gap: 16, width: '100%' }}>
        <img
          src={gifSrc}
          alt=""
          style={{
            width: 200,
            height: 200,
            objectFit: 'cover',
            borderRadius: 24,
            border: `2px solid ${passed ? 'var(--success)' : 'var(--danger)'}`,
          }}
        />

        <h2
          style={{
            fontSize: 24,
            textAlign: 'center',
            color: passed ? 'var(--success)' : 'var(--danger)',
            lineHeight: 1.3,
            marginTop: 8,
          }}
        >
          {verdict}
        </h2>

        <p style={{ fontSize: 14, color: 'var(--ink-dim)' }}>
          {state.testSuccessCount} / 5 {t.testScoreLabel}
        </p>

        <div className="col" style={{ gap: 12, width: '100%', maxWidth: 320, marginTop: 20 }}>
          <button className="btn btn-primary" onClick={() => dispatch({ type: 'START_TEST_MODE' })}>
            {t.testReplay}
          </button>
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_HOME' })}>
            {t.testBackToMenu}
          </button>
        </div>
      </div>
    </div>
  )
}
