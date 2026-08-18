import { useState, useEffect, useRef } from 'react'

export default function TrapNoTouchGame({ config, effects, onComplete }) {
  const { waitMs, temptMs } = config
  const [phase, setPhase] = useState('wait') // wait | tempt | done
  const [status, setStatus] = useState(null)
  const [remaining, setRemaining] = useState(Math.ceil(waitMs / 1000))
  const finishedRef = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(r => Math.max(0, r - 1))
    }, 1000)

    const t1 = setTimeout(() => {
      clearInterval(interval)
      setPhase('tempt')
      // Après la tentation, si le joueur n'a toujours pas craqué, il gagne
      const t2 = setTimeout(() => {
        finish(true)
      }, temptMs)
      return () => clearTimeout(t2)
    }, waitMs)

    return () => {
      clearInterval(interval)
      clearTimeout(t1)
    }
  }, [])

  function handleScreenTouch() {
    if (finishedRef.current) return
    // Toucher l'écran pendant "wait" ou toucher ailleurs que le bouton pendant "tempt" = échec
    finish(false)
  }

  function handleButtonTouch(e) {
    e.stopPropagation()
    if (finishedRef.current) return
    // Céder à la tentation = échec (même si ça semble être l'action "logique")
    finish(false, true)
  }

  function finish(success, gaveIn = false) {
    if (finishedRef.current) return
    finishedRef.current = true
    setStatus(success)
    setPhase('done')
    setTimeout(() => {
      onComplete({
        success,
        scoreDelta: success ? 65 : -20,
        message: success ? 'Résisté à la tentation !' : gaveIn ? 'Tu as craqué...' : 'Tu as touché trop tôt !',
      })
    }, 700)
  }

  return (
    <div
      className="col center grow"
      onClick={phase !== 'done' ? handleScreenTouch : undefined}
      style={{ height: '100%' }}
    >
      {phase === 'wait' && (
        <div className="col center" style={{ gap: 14 }}>
          <h2 style={{ fontSize: 20, textAlign: 'center', color: 'var(--ink)' }}>
            NE TOUCHE PAS<br />L'ÉCRAN
          </h2>
          <span style={{ fontSize: 34, color: 'var(--ink-faint)', fontFamily: 'var(--font-display)' }}>
            {remaining}
          </span>
        </div>
      )}

      {phase === 'tempt' && (
        <button
          onClick={handleButtonTouch}
          className="pop-in"
          style={{
            background: 'var(--wasted)',
            color: 'var(--ink)',
            fontSize: 20,
            fontFamily: 'var(--font-display)',
            padding: '24px 36px',
            borderRadius: 24,
            boxShadow: '0 0 40px rgba(255,63,109,0.6)',
          }}
        >
          🔥 TOUCHE-MOI 🔥
        </button>
      )}

      {phase === 'done' && (
        <div style={{ fontSize: 56 }}>{status ? '✅' : '❌'}</div>
      )}
    </div>
  )
}
