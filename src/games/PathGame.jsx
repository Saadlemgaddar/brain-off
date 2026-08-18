import { useRef, useState, useEffect, useMemo } from 'react'
import CountdownBar from '../components/CountdownBar'
import { getStageClassName, getStageStyle } from '../utils/drunkEffects'

// Génère un chemin en zigzag avec N segments à l'intérieur d'un viewport 300x500
function generatePath(segments) {
  const w = 300
  const h = 480
  const points = [{ x: 40 + Math.random() * 30, y: 30 }]
  const stepY = (h - 60) / segments
  for (let i = 1; i <= segments; i++) {
    const x = 40 + Math.random() * (w - 80)
    const y = 30 + stepY * i
    points.push({ x, y })
  }
  return points
}

function pointsToPath(points) {
  return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
}

function distToSegment(p, a, b) {
  const l2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2
  if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y)
  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2
  t = Math.max(0, Math.min(1, t))
  const proj = { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) }
  return Math.hypot(p.x - proj.x, p.y - proj.y)
}

function minDistToPath(p, points) {
  let min = Infinity
  for (let i = 0; i < points.length - 1; i++) {
    const d = distToSegment(p, points[i], points[i + 1])
    if (d < min) min = d
  }
  return min
}

export default function PathGame({ config, effects, onComplete }) {
  const { segments, width, timeLimit } = config
  const points = useMemo(() => generatePath(segments), [])
  const svgRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [trail, setTrail] = useState([])
  const [status, setStatus] = useState('playing') // playing | success | fail
  const [progress, setProgress] = useState(0)
  const finishedRef = useRef(false)
  const wobbleSeed = useRef(Math.random() * 100)

  const start = points[0]
  const end = points[points.length - 1]

  function getSvgPoint(clientX, clientY) {
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 300
    const y = ((clientY - rect.top) / rect.height) * 480
    return { x, y }
  }

  function handleStart(e) {
    if (status !== 'playing') return
    const touch = e.touches ? e.touches[0] : e
    const p = getSvgPoint(touch.clientX, touch.clientY)
    if (Math.hypot(p.x - start.x, p.y - start.y) < 40) {
      setDragging(true)
      setTrail([p])
    }
  }

  function handleMove(e) {
    if (!dragging || status !== 'playing') return
    const touch = e.touches ? e.touches[0] : e
    let p = getSvgPoint(touch.clientX, touch.clientY)

    // Décalage drunk appliqué à l'input
    if (effects.inputOffset > 0) {
      const t = Date.now() / 220
      p = {
        x: p.x + Math.sin(t + wobbleSeed.current) * (effects.inputOffset * 0.6),
        y: p.y + Math.cos(t * 1.4 + wobbleSeed.current) * (effects.inputOffset * 0.6),
      }
    }

    const dist = minDistToPath(p, points)
    if (dist > width / 2 + 6) {
      finish(false)
      return
    }

    setTrail(prev => [...prev, p])

    const distToEnd = Math.hypot(p.x - end.x, p.y - end.y)
    const totalLen = points.reduce((acc, pt, i) => i === 0 ? 0 : acc + Math.hypot(pt.x - points[i-1].x, pt.y - points[i-1].y), 0)
    setProgress(Math.max(0, Math.min(1, 1 - distToEnd / totalLen)))

    if (distToEnd < 30) {
      finish(true)
    }
  }

  function handleEnd() {
    if (status === 'playing' && dragging && progress < 0.9) {
      // Lâché avant la fin = échec seulement si peu de progression et temps pas écoulé
    }
    setDragging(false)
  }

  function finish(success) {
    if (finishedRef.current) return
    finishedRef.current = true
    setStatus(success ? 'success' : 'fail')
    setTimeout(() => {
      onComplete({
        success,
        scoreDelta: success ? 100 : -30,
        message: success ? 'Chemin suivi sans dévier !' : 'Sorti du chemin !',
      })
    }, 700)
  }

  function handleTimeout() {
    if (status === 'playing') finish(false)
  }

  const pathOpacity = effects.fadeFlicker
    ? 0.35 + Math.sin(Date.now() / 300) * 0.15
    : 1

  return (
    <div className="col" style={{ height: '100%', padding: '0 16px 16px' }}>
      <div style={{ marginBottom: 10 }}>
        <CountdownBar
          durationMs={timeLimit * 1000}
          speedMultiplier={effects.timerSpeedMultiplier}
          onExpire={handleTimeout}
        />
      </div>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-dim)', marginBottom: 8 }}>
        🌀 Suis le chemin du point A au point B sans sortir
      </p>

      <div
        className={`grow ${getStageClassName(effects)}`}
        style={{ position: 'relative', ...getStageStyle(effects) }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 300 480"
          style={{ width: '100%', height: '100%', touchAction: 'none' }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          <path
            d={pointsToPath(points)}
            stroke="var(--surface-hi)"
            strokeWidth={width}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={pathOpacity}
          />
          <path
            d={pointsToPath(points)}
            stroke="var(--ink-faint)"
            strokeWidth={2}
            strokeDasharray="4 6"
            fill="none"
            opacity={0.4}
          />
          {trail.length > 1 && (
            <path
              d={pointsToPath(trail)}
              stroke={status === 'fail' ? 'var(--danger)' : 'var(--acid)'}
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          <circle cx={start.x} cy={start.y} r={20} fill="var(--success)" opacity={0.9} />
          <text x={start.x} y={start.y + 5} textAnchor="middle" fontSize="14" fill="#0B0B14" fontWeight="bold">A</text>
          <circle cx={end.x} cy={end.y} r={20} fill="var(--wasted)" opacity={0.9} />
          <text x={end.x} y={end.y + 5} textAnchor="middle" fontSize="14" fill="#0B0B14" fontWeight="bold">B</text>
        </svg>

        {status !== 'playing' && (
          <div className="center" style={{ position: 'absolute', inset: 0, fontSize: 64 }}>
            {status === 'success' ? '✅' : '❌'}
          </div>
        )}
      </div>
    </div>
  )
}
