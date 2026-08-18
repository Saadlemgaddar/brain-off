import { useRef, useState, useEffect } from 'react'
import CountdownBar from '../components/CountdownBar'

// Génère des points de référence pour chaque forme (dans un repère 200x200 centré)
const SHAPES = {
  circle: (steps = 64) => {
    const pts = []
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2
      pts.push({ x: 100 + Math.cos(a) * 70, y: 100 + Math.sin(a) * 70 })
    }
    return pts
  },
  star: () => {
    const pts = []
    const outer = 80, inner = 34
    for (let i = 0; i <= 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2
      const r = i % 2 === 0 ? outer : inner
      pts.push({ x: 100 + Math.cos(a) * r, y: 100 + Math.sin(a) * r })
    }
    return pts
  },
  heart: () => {
    const pts = []
    for (let i = 0; i <= 64; i++) {
      const t = (i / 64) * Math.PI * 2
      const x = 16 * Math.pow(Math.sin(t), 3)
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
      pts.push({ x: 100 + x * 4.2, y: 100 + y * 4.2 })
    }
    return pts
  },
  zigzag: () => {
    return [
      { x: 30, y: 60 }, { x: 70, y: 150 }, { x: 110, y: 60 },
      { x: 150, y: 150 }, { x: 190, y: 60 }, { x: 170, y: 60 },
    ]
  },
}

const SHAPE_EMOJI = { circle: '⭕', star: '⭐', heart: '❤️', zigzag: '⚡' }

function pointsToPath(points, closed = true) {
  if (!points.length) return ''
  const d = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
  return closed ? d + ' Z' : d
}

// Score de similarité: distance moyenne du tracé utilisateur aux points de référence
function scoreDrawing(userPoints, refPoints) {
  if (userPoints.length < 5) return 0
  let totalDist = 0
  let count = 0
  const sampleStep = Math.max(1, Math.floor(userPoints.length / 80))
  for (let i = 0; i < userPoints.length; i += sampleStep) {
    const up = userPoints[i]
    let minD = Infinity
    for (const rp of refPoints) {
      const d = Math.hypot(up.x - rp.x, up.y - rp.y)
      if (d < minD) minD = d
    }
    totalDist += minD
    count++
  }
  const avgDist = totalDist / count
  // avgDist 0 -> 100%, avgDist >= 60 -> 0%
  const score = Math.max(0, Math.min(100, Math.round(100 - (avgDist / 55) * 100)))
  return score
}

export default function ShapeGame({ config, effects, onComplete }) {
  const { shape, timeLimit } = config
  const refPoints = useRef(SHAPES[shape]()).current
  const svgRef = useRef(null)
  const [userTrail, setUserTrail] = useState([])
  const [drawing, setDrawing] = useState(false)
  const [status, setStatus] = useState('playing')
  const [rotation, setRotation] = useState(0)
  const [shapeOpacity, setShapeOpacity] = useState(1)
  const [shake, setShake] = useState(false)
  const finishedRef = useRef(false)
  const wobbleSeed = useRef(Math.random() * 100)

  // Rotation continue + disparition progressive en mode drunk
  useEffect(() => {
    if (effects.intensity < 0.3) return
    let raf
    const startTime = Date.now()
    function tick() {
      const elapsed = (Date.now() - startTime) / 1000
      setRotation(elapsed * 14 * effects.intensity)
      const fadeSpeed = effects.intensity * 0.3
      setShapeOpacity(Math.max(0.25, 1 - elapsed * fadeSpeed * 0.15))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [effects.intensity])

  // Tremblement aléatoire du téléphone
  useEffect(() => {
    if (effects.screenShake) {
      const interval = setInterval(() => {
        setShake(true)
        setTimeout(() => setShake(false), 400)
      }, 1800 + Math.random() * 1200)
      return () => clearInterval(interval)
    }
  }, [effects.screenShake])

  function getSvgPoint(clientX, clientY) {
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 200
    const y = ((clientY - rect.top) / rect.height) * 200
    return { x, y }
  }

  function handleStart(e) {
    if (status !== 'playing') return
    const touch = e.touches ? e.touches[0] : e
    setDrawing(true)
    setUserTrail([getSvgPoint(touch.clientX, touch.clientY)])
  }

  function handleMove(e) {
    if (!drawing || status !== 'playing') return
    const touch = e.touches ? e.touches[0] : e
    let p = getSvgPoint(touch.clientX, touch.clientY)

    if (effects.inputOffset > 0) {
      const t = Date.now() / 220
      p = {
        x: p.x + Math.sin(t + wobbleSeed.current) * (effects.inputOffset * 0.5),
        y: p.y + Math.cos(t * 1.4 + wobbleSeed.current) * (effects.inputOffset * 0.5),
      }
    }

    setUserTrail(prev => [...prev, p])
  }

  function handleEnd() {
    setDrawing(false)
  }

  function finish() {
    if (finishedRef.current) return
    finishedRef.current = true
    const score = scoreDrawing(userTrail, refPoints)
    const success = score >= 45
    setStatus(success ? 'success' : 'fail')
    setTimeout(() => {
      onComplete({
        success,
        scoreDelta: success ? Math.round(score) : -30,
        message: `Ressemblance : ${score}%`,
      })
    }, 900)
  }

  function handleTimeout() {
    if (status === 'playing') finish()
  }

  return (
    <div className="col" style={{ height: '100%', padding: '0 16px 16px' }}>
      <div style={{ marginBottom: 10 }}>
        <CountdownBar
          durationMs={timeLimit * 1000}
          speedMultiplier={effects.timerSpeedMultiplier}
          onExpire={handleTimeout}
        />
      </div>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-dim)', marginBottom: 4 }}>
        ✍️ Reproduis la forme {SHAPE_EMOJI[shape]}
      </p>

      <div
        className={`grow center ${shake ? 'shake' : ''}`}
        style={{ position: 'relative' }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 200 200"
          style={{ width: '90%', maxWidth: 320, touchAction: 'none', filter: effects.blurPx > 0.1 ? `blur(${effects.blurPx}px)` : 'none' }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          <g style={{ transformOrigin: '100px 100px', transform: `rotate(${rotation}deg)` }}>
            <path
              d={pointsToPath(refPoints, shape !== 'zigzag')}
              stroke="var(--surface-hi)"
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={shapeOpacity}
            />
          </g>
          {userTrail.length > 1 && (
            <path
              d={pointsToPath(userTrail, false)}
              stroke="var(--acid)"
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {status !== 'playing' && (
          <div className="center" style={{ position: 'absolute', inset: 0, fontSize: 64, background: 'rgba(11,11,20,0.6)' }}>
            {status === 'success' ? '✅' : '❌'}
          </div>
        )}
      </div>
    </div>
  )
}
