import { useState, useMemo, useRef } from 'react'
import CountdownBar from '../components/CountdownBar'

// Paires "normal / intrus" avec différents niveaux de subtilité
const PAIR_SETS = {
  high: [
    { base: '🍺', odd: '🍻' },
    { base: '⭐', odd: '🌟' },
    { base: '🔵', odd: '🟢' },
    { base: '❤️', odd: '🧡' },
  ],
  medium: [
    { base: '🍺', odd: '🍺' }, // rotation gérée via CSS pour subtilité
    { base: '⚪', odd: '⚪' },
    { base: '🟡', odd: '🟠' },
  ],
  low: [
    { base: '⚪', odd: '⚪' },
    { base: '🔴', odd: '🔴' },
  ],
}

export default function OddOneOutGame({ config, effects, onComplete }) {
  const { gridSize, contrast, timeLimit } = config
  const [status, setStatus] = useState(null)
  const finishedRef = useRef(false)

  const setup = useMemo(() => {
    const cols = 5
    const rows = Math.ceil(gridSize / cols)
    const total = cols * rows
    const oddIndex = Math.floor(Math.random() * total)

    let baseEmoji, oddEmoji, oddStyle = {}
    if (contrast === 'high') {
      const pair = PAIR_SETS.high[Math.floor(Math.random() * PAIR_SETS.high.length)]
      baseEmoji = pair.base
      oddEmoji = pair.odd
    } else if (contrast === 'medium') {
      baseEmoji = '🍺'
      oddEmoji = '🍺'
      oddStyle = { transform: 'scaleX(-1)', filter: 'brightness(0.85)' }
    } else {
      baseEmoji = '⚪'
      oddEmoji = '⚪'
      oddStyle = { opacity: 0.82 }
    }

    return { cols, rows, total, oddIndex, baseEmoji, oddEmoji, oddStyle }
  }, [gridSize, contrast])

  function finish(success) {
    if (finishedRef.current) return
    finishedRef.current = true
    setStatus(success)
    setTimeout(() => {
      onComplete({
        success,
        scoreDelta: success ? 85 : -25,
        message: success ? 'Bon œil !' : "L'intrus t'a échappé",
      })
    }, 500)
  }

  const cells = Array.from({ length: setup.total }, (_, i) => i)

  return (
    <div className="col" style={{ height: '100%', padding: '0 16px 16px' }}>
      <div style={{ marginBottom: 10 }}>
        <CountdownBar durationMs={timeLimit * 1000} speedMultiplier={effects.timerSpeedMultiplier} onExpire={() => finish(false)} />
      </div>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-dim)', marginBottom: 12 }}>
        👀 Trouve l'intrus dans la grille
      </p>

      <div
        className="grow"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${setup.cols}, 1fr)`,
          gap: 8,
          alignContent: 'center',
          filter: effects.blurPx > 0.1 ? `blur(${effects.blurPx * 0.4}px)` : 'none',
        }}
      >
        {cells.map(i => (
          <button
            key={i}
            disabled={status !== null}
            onClick={() => finish(i === setup.oddIndex)}
            className="center"
            style={{
              aspectRatio: '1',
              fontSize: 24,
              background: 'var(--surface)',
              borderRadius: 12,
              border: status !== null && i === setup.oddIndex ? '2px solid var(--success)' : '2px solid transparent',
              ...(i === setup.oddIndex ? setup.oddStyle : {}),
            }}
          >
            {i === setup.oddIndex ? setup.oddEmoji : setup.baseEmoji}
          </button>
        ))}
      </div>

      {status !== null && (
        <div className="center" style={{ fontSize: 50, marginTop: 12 }}>
          {status ? '✅' : '❌'}
        </div>
      )}
    </div>
  )
}
