import { useState, useEffect, useRef, useMemo } from 'react'
import CountdownBar from '../components/CountdownBar'

const EMOJI_POOL = ['🍌', '🍎', '🍇', '🍉', '🍕', '🎈', '⚽', '🎸', '🚗', '👑', '🐱', '🐶', '🌙', '⭐', '🔥', '💎', '🎲', '🍔', '🎁', '🦄']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MemoryGame({ config, effects, onComplete }) {
  const { count, flashMs, question } = config

  const setup = useMemo(() => {
    const chosen = shuffle(EMOJI_POOL).slice(0, count)
    const isPositionQ = question === 'position'
    let targetIndex = null
    let missingEmoji = null
    let displayItems = chosen

    if (isPositionQ) {
      targetIndex = Math.floor(Math.random() * count)
    } else {
      // "missing" -> on montre count items, puis on demande lequel d'une liste de count+1 n'était pas présent
      missingEmoji = shuffle(EMOJI_POOL.filter(e => !chosen.includes(e)))[0]
    }
    return { chosen, targetIndex, missingEmoji, isPositionQ }
  }, [count, question])

  const [phase, setPhase] = useState('flash') // flash | question | done
  const [positions, setPositions] = useState([])
  const [status, setStatus] = useState(null)
  const finishedRef = useRef(false)

  // Positions dans une grille, potentiellement ré-agencées rapidement en mode Drunk
  useEffect(() => {
    const cols = count <= 4 ? 2 : 3
    const base = setup.chosen.map((_, i) => i)
    setPositions(base)

    if (effects.intensity > 0.5) {
      const interval = setInterval(() => {
        setPositions(shuffle(base))
      }, 500)
      const t = setTimeout(() => clearInterval(interval), flashMs)
      return () => { clearInterval(interval); clearTimeout(t) }
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setPhase('question'), flashMs)
    return () => clearTimeout(t)
  }, [flashMs])

  function finish(success) {
    if (finishedRef.current) return
    finishedRef.current = true
    setStatus(success)
    setTimeout(() => {
      onComplete({
        success,
        scoreDelta: success ? 90 : -30,
        message: success ? 'Bonne mémoire !' : 'Raté !',
      })
    }, 700)
  }

  const cols = count <= 4 ? 2 : 3

  if (phase === 'flash') {
    return (
      <div className="col center" style={{ height: '100%', padding: 16 }}>
        <p style={{ fontSize: 13, color: 'var(--ink-dim)', marginBottom: 16 }}>
          🧠 Mémorise bien...
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 14,
            width: '100%',
            maxWidth: 320,
          }}
        >
          {positions.map((origIdx, slot) => (
            <div
              key={slot}
              className="center pop-in"
              style={{
                aspectRatio: '1',
                fontSize: 40,
                background: 'var(--surface)',
                borderRadius: 18,
                filter: effects.blurPx > 0.1 ? `blur(${effects.blurPx * 0.6}px)` : 'none',
              }}
            >
              {setup.chosen[origIdx]}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (setup.isPositionQ) {
    const targetEmoji = setup.chosen[setup.targetIndex]
    const options = setup.chosen.map((_, i) => i)

    return (
      <div className="col" style={{ height: '100%', padding: 16 }}>
        <div style={{ marginBottom: 10 }}>
          <CountdownBar durationMs={7000} speedMultiplier={effects.timerSpeedMultiplier} onExpire={() => finish(false)} />
        </div>
        <p style={{ textAlign: 'center', fontSize: 15, marginBottom: 20 }}>
          Où était {targetEmoji} ?
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 14,
            width: '100%',
            maxWidth: 320,
            margin: '0 auto',
          }}
        >
          {options.map(i => (
            <button
              key={i}
              disabled={status !== null}
              onClick={() => finish(i === setup.targetIndex)}
              className="center"
              style={{
                aspectRatio: '1',
                fontSize: 28,
                background: 'var(--surface)',
                borderRadius: 18,
                color: 'var(--ink-faint)',
                border: status !== null && i === setup.targetIndex ? '3px solid var(--success)' : '3px solid transparent',
              }}
            >
              ?
            </button>
          ))}
        </div>
        {status !== null && (
          <div className="center" style={{ fontSize: 50, marginTop: 20 }}>
            {status ? '✅' : '❌'}
          </div>
        )}
      </div>
    )
  }

  // question === 'missing'
  const optionsPool = shuffle([...setup.chosen, setup.missingEmoji])
  return (
    <div className="col" style={{ height: '100%', padding: 16 }}>
      <div style={{ marginBottom: 10 }}>
        <CountdownBar durationMs={7000} speedMultiplier={effects.timerSpeedMultiplier} onExpire={() => finish(false)} />
      </div>
      <p style={{ textAlign: 'center', fontSize: 15, marginBottom: 20 }}>
        Quel objet n'était PAS présent ?
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 14,
          width: '100%',
          maxWidth: 320,
          margin: '0 auto',
        }}
      >
        {optionsPool.map((emoji, i) => (
          <button
            key={i}
            disabled={status !== null}
            onClick={() => finish(emoji === setup.missingEmoji)}
            className="center"
            style={{
              aspectRatio: '1',
              fontSize: 34,
              background: 'var(--surface)',
              borderRadius: 18,
              border: status !== null && emoji === setup.missingEmoji ? '3px solid var(--success)' : '3px solid transparent',
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
      {status !== null && (
        <div className="center" style={{ fontSize: 50, marginTop: 20 }}>
          {status ? '✅' : '❌'}
        </div>
      )}
    </div>
  )
}
