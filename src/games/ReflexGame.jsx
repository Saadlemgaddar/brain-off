import { useState, useEffect, useRef } from 'react'

// Séquence de rounds: chaque round affiche TAP ou DON'T TAP après un délai variable.
export default function ReflexGame({ config, effects, onComplete }) {
  const { rounds, trapChance } = config
  const [roundIndex, setRoundIndex] = useState(0)
  const [phase, setPhase] = useState('waiting') // waiting | shown | result
  const [current, setCurrent] = useState(null) // 'tap' | 'notap'
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const finishedRef = useRef(false)
  const timeoutRef = useRef(null)
  const shownAtRef = useRef(0)

  useEffect(() => {
    startRound()
    return () => clearTimeout(timeoutRef.current)
  }, [roundIndex])

  function startRound() {
    setPhase('waiting')
    setFeedback(null)
    const delay = 700 + Math.random() * 1600
    timeoutRef.current = setTimeout(() => {
      const isTrap = Math.random() < trapChance
      setCurrent(isTrap ? 'notap' : 'tap')
      setPhase('shown')
      shownAtRef.current = Date.now()

      // Auto-résolution si personne ne tape à temps
      timeoutRef.current = setTimeout(() => {
        resolveRound(isTrap ? true : false, isTrap)
      }, 900)
    }, delay)
  }

  function resolveRound(correct, wasTrap) {
    clearTimeout(timeoutRef.current)
    setPhase('result')
    setFeedback(correct)
    if (correct) setScore(s => s + 1)

    if (roundIndex + 1 >= rounds) {
      setTimeout(() => finish(score + (correct ? 1 : 0)), 550)
    } else {
      setTimeout(() => setRoundIndex(r => r + 1), 550)
    }
  }

  function handleTap() {
    if (phase === 'waiting') {
      // Tap prématuré = faux départ
      clearTimeout(timeoutRef.current)
      setPhase('result')
      setFeedback(false)
      setCurrent('early')
      if (roundIndex + 1 >= rounds) {
        setTimeout(() => finish(score), 550)
      } else {
        setTimeout(() => setRoundIndex(r => r + 1), 550)
      }
      return
    }
    if (phase !== 'shown') return
    const correct = current === 'tap'
    resolveRound(correct, current === 'notap')
  }

  function finish(finalScore) {
    if (finishedRef.current) return
    finishedRef.current = true
    const success = finalScore >= Math.ceil(rounds * 0.6)
    setTimeout(() => {
      onComplete({
        success,
        scoreDelta: success ? 75 : -20,
        message: `${finalScore}/${rounds} bons réflexes`,
      })
    }, 300)
  }

  const bg = phase === 'shown'
    ? current === 'tap' ? 'var(--success)' : 'var(--danger)'
    : 'var(--surface)'

  return (
    <div
      className="col center grow"
      onClick={handleTap}
      style={{ height: '100%', background: bg, transition: 'background 0.1s' }}
    >
      <div className="col center" style={{ gap: 16 }}>
        <p style={{ fontSize: 12, color: 'rgba(242,241,246,0.6)' }}>
          Round {roundIndex + 1}/{rounds} · Score: {score}
        </p>
        {phase === 'waiting' && (
          <h2 style={{ fontSize: 20, color: 'var(--ink-faint)' }}>Attends...</h2>
        )}
        {phase === 'shown' && current === 'tap' && (
          <h1 className="pop-in" style={{ fontSize: 36 }}>TAP 👆</h1>
        )}
        {phase === 'shown' && current === 'notap' && (
          <h1 className="pop-in" style={{ fontSize: 36 }}>DON'T TAP ❌</h1>
        )}
        {phase === 'result' && (
          <div style={{ fontSize: 50 }}>{feedback ? '✅' : '❌'}</div>
        )}
      </div>
    </div>
  )
}
