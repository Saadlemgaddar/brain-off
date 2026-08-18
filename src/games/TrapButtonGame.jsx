import { useState, useMemo, useRef } from 'react'
import CountdownBar from '../components/CountdownBar'

const COLORS = ['#3F8FFF', '#4FFFA0', '#FF3F6D', '#FFC93F', '#B83FFF']

export default function TrapButtonGame({ config, effects, onComplete }) {
  const { buttonCount, timeLimit } = config
  const [status, setStatus] = useState(null)
  const finishedRef = useRef(false)
  const startTimeRef = useRef(Date.now())

  const greenIndex = useMemo(() => Math.floor(Math.random() * buttonCount), [buttonCount])
  // Le piège : le bouton vert est toujours là, mais dès qu'on le touche, "trop lent" s'affiche
  // avec une petite chance de vraie réussite si tapé très vite -> gag garanti la plupart du temps.

  function handleTap(index) {
    if (status !== null) return
    const elapsed = Date.now() - startTimeRef.current
    const isGreen = index === greenIndex
    finishedRef.current = true

    if (!isGreen) {
      setStatus('wrong')
      setTimeout(() => onComplete({ success: false, scoreDelta: -20, message: "Mauvais bouton !" }), 700)
      return
    }

    // Piège comique : même en touchant le bon bouton, le jeu dit "trop lent" sauf ultra rapide (<450ms)
    const reallyFast = elapsed < 450
    setStatus(reallyFast ? 'win' : 'trap')
    setTimeout(() => {
      onComplete({
        success: reallyFast,
        scoreDelta: reallyFast ? 60 : -15,
        message: reallyFast ? 'Réflexes de ninja !' : 'Trop lent ! 😂',
      })
    }, 900)
  }

  return (
    <div className="col" style={{ height: '100%', padding: '0 16px 16px' }}>
      <div style={{ marginBottom: 10 }}>
        <CountdownBar
          durationMs={timeLimit * 1000}
          speedMultiplier={effects.timerSpeedMultiplier}
          onExpire={() => {
            if (!finishedRef.current) {
              finishedRef.current = true
              onComplete({ success: false, scoreDelta: -20, message: 'Trop lent !' })
            }
          }}
        />
      </div>
      <p style={{ textAlign: 'center', fontSize: 15, marginBottom: 24 }}>
        🟢 TOUCHE LE BOUTON VERT
      </p>

      <div className="grow col center" style={{ gap: 14 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: buttonCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleTap(i)}
              disabled={status !== null}
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: i === greenIndex ? '#4FFFA0' : COLORS[i % COLORS.length],
                opacity: i === greenIndex ? 1 : 0.85,
              }}
            />
          ))}
        </div>

        {status === 'trap' && (
          <div className="col center pop-in" style={{ marginTop: 20, gap: 6 }}>
            <span style={{ fontSize: 40 }}>😂</span>
            <h2 style={{ fontSize: 20, color: 'var(--wasted)' }}>TROP LENT.</h2>
          </div>
        )}
        {status === 'win' && (
          <div className="col center pop-in" style={{ marginTop: 20 }}>
            <span style={{ fontSize: 40 }}>⚡</span>
          </div>
        )}
        {status === 'wrong' && (
          <div className="col center pop-in" style={{ marginTop: 20 }}>
            <span style={{ fontSize: 40 }}>❌</span>
          </div>
        )}
      </div>
    </div>
  )
}
