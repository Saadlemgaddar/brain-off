import { useState, useMemo, useRef, useEffect } from 'react'
import CountdownBar from '../components/CountdownBar'

const NEUTRAL_EMOJI = '🎲'
const ALCOHOL_EMOJI = '🍺'

function generateProblem(ops, maxNum) {
  const numbers = []
  const operators = []
  for (let i = 0; i <= ops; i++) {
    numbers.push(1 + Math.floor(Math.random() * maxNum))
  }
  for (let i = 0; i < ops; i++) {
    operators.push(Math.random() > 0.5 ? '+' : (Math.random() > 0.5 ? '×' : '-'))
  }
  // Calcule avec priorité × avant + et -
  let terms = [numbers[0]]
  let pendingOps = []
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '×') {
      terms[terms.length - 1] *= numbers[i + 1]
    } else {
      terms.push(numbers[i + 1])
      pendingOps.push(operators[i])
    }
  }
  let result = terms[0]
  for (let i = 0; i < pendingOps.length; i++) {
    result = pendingOps[i] === '+' ? result + terms[i + 1] : result - terms[i + 1]
  }
  return { numbers, operators, result }
}

function buildExpressionString(numbers, operators, emojiNumbers, emoji) {
  let str = emojiNumbers ? emoji : String(numbers[0])
  for (let i = 0; i < operators.length; i++) {
    str += ` ${operators[i]} ${emojiNumbers ? emoji : numbers[i + 1]}`
  }
  return str
}

function generateChoices(correct) {
  const choices = new Set([correct])
  while (choices.size < 4) {
    const delta = Math.floor(Math.random() * 10) - 5
    const candidate = correct + (delta === 0 ? 1 : delta)
    choices.add(candidate)
  }
  return [...choices].sort(() => Math.random() - 0.5)
}

export default function MathGame({ config, effects, onComplete, alcoholMode }) {
  const { ops, maxNum, timeLimit, emojiNumbers } = config
  const problem = useMemo(() => generateProblem(ops, maxNum), [])
  const choices = useMemo(() => generateChoices(problem.result), [problem])
  const [status, setStatus] = useState(null)
  const finishedRef = useRef(false)
  const [wiggle, setWiggle] = useState(false)
  const emoji = alcoholMode ? ALCOHOL_EMOJI : NEUTRAL_EMOJI

  useEffect(() => {
    if (effects.intensity > 0.5) {
      const interval = setInterval(() => setWiggle(w => !w), 500)
      return () => clearInterval(interval)
    }
  }, [effects.intensity])

  function finish(success) {
    if (finishedRef.current) return
    finishedRef.current = true
    setStatus(success)
    setTimeout(() => {
      onComplete({
        success,
        scoreDelta: success ? 70 : -25,
        message: success ? 'Bon calcul !' : `La réponse était ${problem.result}`,
      })
    }, 700)
  }

  const exprText = buildExpressionString(problem.numbers, problem.operators, emojiNumbers, emoji)
  // Timer plus généreux : on plafonne l'accélération drunk pour éviter un temps ridicule sur les niveaux courts
  const cappedSpeedMultiplier = Math.min(effects.timerSpeedMultiplier, 1.2)
  const effectiveTimeMs = Math.max(timeLimit, 4) * 1000 // plancher à 4s même si la config dit moins

  return (
    <div className="col" style={{ height: '100%', padding: '0 16px 16px' }}>
      <div style={{ marginBottom: 10 }}>
        <CountdownBar durationMs={effectiveTimeMs} speedMultiplier={cappedSpeedMultiplier} onExpire={() => finish(false)} />
      </div>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-dim)', marginBottom: 20 }}>
        🔢 Résous vite !
      </p>

      <div className="col center grow" style={{ gap: 28 }}>
        <h2
          style={{
            fontSize: emojiNumbers ? 40 : 32,
            textAlign: 'center',
            transform: wiggle ? `rotate(${effects.intensity * 4}deg) scale(1.05)` : 'rotate(0deg) scale(1)',
            transition: 'transform 0.5s ease',
            filter: effects.blurPx > 0.1 ? `blur(${effects.blurPx * 0.4}px)` : 'none',
          }}
        >
          {exprText} = ?
        </h2>
        {emojiNumbers && (
          <p style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
            ({emoji} = {problem.numbers.join(', ')})
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', maxWidth: 300 }}>
          {choices.map((c, i) => (
            <button
              key={i}
              disabled={status !== null}
              onClick={() => finish(c === problem.result)}
              className="btn"
              style={{
                background: status !== null && c === problem.result ? 'var(--success)' : 'var(--surface)',
                fontSize: 22,
                padding: 18,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
