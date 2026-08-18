import { useEffect, useRef, useState } from 'react'
import { useGame } from '../context/GameContext'
import { UI_TEXT, getResultVoiceLines, getRandomLine, getDrinkAssignLine } from '../utils/i18n'
import { speak } from '../utils/voice'
import { getResultGif, SOUNDS } from '../utils/media'
import { playSound } from '../utils/sound'

export default function ResultScreen() {
  const { state, currentPlayer, dispatch } = useGame()
  const { lastResult } = state
  const spokenRef = useRef(false)
  const soundPlayedRef = useRef(false)
  const lang = state.language || 'fr'
  const t = UI_TEXT[lang]
  const [canContinue, setCanContinue] = useState(!state.voiceEnabled) // si la voix est coupée, on peut continuer tout de suite

  // Choisit UNE ligne aléatoire pour ce résultat, mémorisée pour rester cohérente
  // entre l'affichage texte et l'audio (pas de tirage différent pour chacun).
  const lineRef = useRef(null)
  if (lineRef.current === null && lastResult) {
    const pool = getResultVoiceLines(lang, !!state.alcoholMode, lastResult.success)
    lineRef.current = getRandomLine(pool)
  }

  const drinkLine = lastResult && state.alcoholMode && lastResult.drinkTargetName && !state.isTestMode
    ? getDrinkAssignLine(lang, lastResult.success, lastResult.drinkTargetName)
    : null

  const gifSrc = lastResult ? getResultGif(!!state.alcoholMode, lastResult.success) : null

  // Bruitage joué une seule fois dès l'affichage du résultat (indépendant de la voix,
  // les deux peuvent se superposer légèrement — c'est voulu, comme un vrai jeu de soirée).
  useEffect(() => {
    if (!lastResult || soundPlayedRef.current) return
    soundPlayedRef.current = true
    playSound(lastResult.success ? SOUNDS.applause : SOUNDS.buzzer, { volume: 0.5 })
  }, [])

  useEffect(() => {
    if (!lastResult || spokenRef.current) return
    spokenRef.current = true

    if (!state.voiceEnabled) {
      setCanContinue(true)
      return
    }

    // On attend la fin RÉELLE de la voix avant d'autoriser à continuer — pas de délai fixe arbitraire.
    async function speakSequence() {
      const namePrefix = currentPlayer?.name && !state.isTestMode ? `${currentPlayer.name}. ` : ''
      await speak(namePrefix + lineRef.current, lang)
      if (drinkLine) {
        await speak(drinkLine, lang)
      }
      setCanContinue(true)
    }
    speakSequence()
  }, [])

  if (!lastResult) return null

  function handleContinue(e) {
    e.stopPropagation()
    dispatch({ type: 'NEXT_ROUND' })
  }

  return (
    <div
      className="screen center fade-in"
      style={{
        background: lastResult.success
          ? 'radial-gradient(circle at center, #123322 0%, #0B0B14 70%)'
          : 'radial-gradient(circle at center, #331222 0%, #0B0B14 70%)',
      }}
      onClick={canContinue ? handleContinue : undefined}
    >
      <div className="col center pop-in" style={{ gap: 14, padding: '0 32px', textAlign: 'center' }}>
        {gifSrc && (
          <img
            src={gifSrc}
            alt=""
            style={{
              width: 160,
              height: 160,
              objectFit: 'cover',
              borderRadius: 20,
              border: `2px solid ${lastResult.success ? 'var(--success)' : 'var(--danger)'}`,
            }}
          />
        )}
        {lastResult.message && (
          <p style={{ fontSize: 14, color: 'var(--ink-faint)' }}>{lastResult.message}</p>
        )}
        <h2 style={{ fontSize: 21, color: lastResult.success ? 'var(--success)' : 'var(--danger)', lineHeight: 1.35 }}>
          {currentPlayer?.name && !state.isTestMode && <span style={{ color: 'var(--ink)' }}>{currentPlayer.name.toUpperCase()}. </span>}
          {lineRef.current}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 4 }}>
          {lastResult.scoreDelta >= 0 ? '+' : ''}{lastResult.scoreDelta} {t.points}
        </p>

        {drinkLine && (
          <div
            className="pop-in"
            style={{
              marginTop: 10,
              padding: '14px 20px',
              background: 'var(--surface)',
              borderRadius: 16,
              border: '2px solid var(--drunk)',
            }}
          >
            <p style={{ fontSize: 15, fontWeight: 600 }}>🍺 {drinkLine}</p>
          </div>
        )}

        {canContinue ? (
          <button
            onClick={handleContinue}
            className="btn btn-primary pop-in"
            style={{ marginTop: 20, padding: '16px 32px' }}
          >
            {t.nextRound} →
          </button>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 20 }}>
            🔊 …
          </p>
        )}
      </div>
    </div>
  )
}
