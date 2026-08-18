import { useState, useEffect, useRef } from 'react'
import CountdownBar from '../components/CountdownBar'

// Séquence de couleurs à taper dans l'ordre: bleu -> rouge -> vert (jusqu'à `targets`)
const SEQUENCE_COLORS = ['#3F8FFF', '#FF3F6D', '#4FFFA0']
const SEQUENCE_EMOJI = ['🔵', '🔴', '🟢']

export default function AimGame({ config, effects, onComplete }) {
  const { targets, size, timeLimit, moving } = config
  const [step, setStep] = useState(0)
  const [pos, setPos] = useState({ x: 50, y: 50 }) // en %
  const [status, setStatus] = useState(null)
  const finishedRef = useRef(false)
  const containerRef = useRef(null)
  const moveIntervalRef = useRef(null)

  function randomPos() {
    return {
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 60,
    }
  }

  useEffect(() => {
    setPos(randomPos())
  }, [step])

  // Mouvement imprévisible en mode Drunk
  useEffect(() => {
    if ((moving || effects.intensity > 0.4) && status === null) {
      moveIntervalRef.current = setInterval(() => {
        setPos(randomPos())
      }, Math.max(400, 1000 - effects.intensity * 600))
      return () => clearInterval(moveIntervalRef.current)
    }
  }, [step, moving, effects.intensity, status])

  function handleTap() {
    if (status !== null) return
    clearInterval(moveIntervalRef.current)
    if (step + 1 >= targets) {
      finish(true)
    } else {
      setStep(step + 1)
    }
  }

  function finish(success) {
    if (finishedRef.current) return
    finishedRef.current = true
    setStatus(success)
    setTimeout(() => {
      onComplete({
        success,
        scoreDelta: success ? 80 : -25,
        message: success ? 'Cible touchée !' : 'Trop lent !',
      })
    }, 500)
  }

  function handleTimeout() {
    if (status === null) finish(false)
  }

  const color = SEQUENCE_COLORS[step % SEQUENCE_COLORS.length]
  const emoji = SEQUENCE_EMOJI[step % SEQUENCE_EMOJI.length]

  return (
    <div className="col" style={{ height: '100%', padding: '0 16px 16px' }}>
      <div style={{ marginBottom: 10 }}>
        <CountdownBar durationMs={timeLimit * 1000} speedMultiplier={effects.timerSpeedMultiplier} onExpire={handleTimeout} />
      </div>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-dim)', marginBottom: 8 }}>
        🎯 Touche la cible {emoji} ({step + 1}/{targets})
      </p>

      <div
        ref={containerRef}
        className="grow"
        style={{ position: 'relative', filter: effects.blurPx > 0.1 ? `blur(${effects.blurPx * 0.5}px)` : 'none' }}
      >
        {status === null && (
          <button
            onClick={handleTap}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              transform: 'translate(-50%, -50%)',
              transition: moving || effects.intensity > 0.4 ? 'left 0.35s ease, top 0.35s ease' : 'none',
              boxShadow: `0 0 24px ${color}88`,
            }}
          />
        )}
        {status !== null && (
          <div className="center" style={{ position: 'absolute', inset: 0, fontSize: 64 }}>
            {status ? '✅' : '❌'}
          </div>
        )}
      </div>
    </div>
  )
}
