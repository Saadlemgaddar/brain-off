import { useEffect, useRef, useState } from 'react'

// Countdown visuel + callback onExpire. Piloté par un multiplicateur de vitesse
// (utilisé en mode Drunk pour accélérer le compte à rebours -> effet stressant).
export default function CountdownBar({ durationMs, speedMultiplier = 1, onExpire, color = 'var(--acid)' }) {
  const [pct, setPct] = useState(100)
  const startRef = useRef(Date.now())
  const rafRef = useRef(null)
  const expiredRef = useRef(false)

  useEffect(() => {
    startRef.current = Date.now()
    expiredRef.current = false

    function tick() {
      const elapsed = (Date.now() - startRef.current) * speedMultiplier
      const remaining = Math.max(0, 1 - elapsed / durationMs)
      setPct(remaining * 100)
      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true
        onExpire?.()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [durationMs, speedMultiplier])

  const dangerColor = pct < 25 ? 'var(--danger)' : color

  return (
    <div className="meter-track">
      <div
        className="meter-fill"
        style={{ width: `${pct}%`, background: dangerColor, transition: 'width 0.05s linear, background 0.3s' }}
      />
    </div>
  )
}
