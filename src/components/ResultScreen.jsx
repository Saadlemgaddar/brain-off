import { useEffect } from 'react'
import { useGame } from '../context/GameContext'

const ROAST_LINES_FAIL = [
  "EST OFFICIELLEMENT BOURRÉ 😂",
  "A PERDU LE CONTRÔLE DE SON CERVEAU 🧠💥",
  "DEVRAIT PEUT-ÊTRE BOIRE UN VERRE D'EAU 💧",
  "N'A PLUS DE COORDINATION 🥴",
  "EST EN PLEIN BRAIN OFF 📴",
]

const HYPE_LINES_SUCCESS = [
  "TIENT ENCORE DEBOUT 💪",
  "A UN CERVEAU EN BÉTON 🧠🔥",
  "SURVIT ENCORE UN TOUR 😎",
  "IMPRESSIONNE LA TABLE 👏",
]

export default function ResultScreen() {
  const { state, currentPlayer, dispatch } = useGame()
  const { lastResult } = state

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch({ type: 'NEXT_ROUND' })
    }, 2200)
    return () => clearTimeout(t)
  }, [])

  if (!lastResult) return null

  const line = lastResult.success
    ? HYPE_LINES_SUCCESS[Math.floor(Math.random() * HYPE_LINES_SUCCESS.length)]
    : ROAST_LINES_FAIL[Math.floor(Math.random() * ROAST_LINES_FAIL.length)]

  return (
    <div className="screen center fade-in" style={{ background: lastResult.success ? 'radial-gradient(circle at center, #123322 0%, #0B0B14 70%)' : 'radial-gradient(circle at center, #331222 0%, #0B0B14 70%)' }}>
      <div className="col center pop-in" style={{ gap: 14, padding: '0 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>
          {lastResult.success ? '✅' : '❌'}
        </div>
        {lastResult.message && (
          <p style={{ fontSize: 15, color: 'var(--ink-dim)' }}>{lastResult.message}</p>
        )}
        <h2 style={{ fontSize: 22, color: lastResult.success ? 'var(--success)' : 'var(--danger)', lineHeight: 1.3 }}>
          {currentPlayer?.name?.toUpperCase()} {line}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 4 }}>
          {lastResult.scoreDelta >= 0 ? '+' : ''}{lastResult.scoreDelta} points
        </p>
      </div>
    </div>
  )
}
