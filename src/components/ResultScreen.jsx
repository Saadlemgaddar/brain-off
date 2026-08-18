import { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'
import { UI_TEXT, getResultVoiceLines, getRandomLine } from '../utils/i18n'
import { speak } from '../utils/voice'

export default function ResultScreen() {
  const { state, currentPlayer, dispatch } = useGame()
  const { lastResult } = state
  const spokenRef = useRef(false)
  const lang = state.language || 'fr'
  const t = UI_TEXT[lang]

  // Choisit UNE ligne aléatoire pour ce résultat, mémorisée pour rester cohérente
  // entre l'affichage texte et l'audio (pas de tirage différent pour chacun).
  const lineRef = useRef(null)
  if (lineRef.current === null && lastResult) {
    const pool = getResultVoiceLines(lang, !!state.alcoholMode, lastResult.success)
    lineRef.current = getRandomLine(pool)
  }

  useEffect(() => {
    if (!lastResult || spokenRef.current) return
    spokenRef.current = true
    if (state.voiceEnabled) {
      const namePrefix = currentPlayer?.name ? `${currentPlayer.name}. ` : ''
      speak(namePrefix + lineRef.current, lang)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch({ type: 'NEXT_ROUND' })
    }, 2400)
    return () => clearTimeout(t)
  }, [])

  if (!lastResult) return null

  return (
    <div
      className="screen center fade-in"
      style={{
        background: lastResult.success
          ? 'radial-gradient(circle at center, #123322 0%, #0B0B14 70%)'
          : 'radial-gradient(circle at center, #331222 0%, #0B0B14 70%)',
      }}
    >
      <div className="col center pop-in" style={{ gap: 14, padding: '0 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>
          {lastResult.success ? '✅' : '❌'}
        </div>
        {lastResult.message && (
          <p style={{ fontSize: 14, color: 'var(--ink-faint)' }}>{lastResult.message}</p>
        )}
        <h2 style={{ fontSize: 21, color: lastResult.success ? 'var(--success)' : 'var(--danger)', lineHeight: 1.35 }}>
          {currentPlayer?.name && <span style={{ color: 'var(--ink)' }}>{currentPlayer.name.toUpperCase()}. </span>}
          {lineRef.current}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 4 }}>
          {lastResult.scoreDelta >= 0 ? '+' : ''}{lastResult.scoreDelta} {t.points}
        </p>
      </div>
    </div>
  )
}
