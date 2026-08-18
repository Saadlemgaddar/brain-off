import { useRef, useState, useMemo } from 'react'
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

// Décalage vertical appliqué à la position du doigt : sur mobile, le doigt cache le point
// qu'on essaie de toucher, donc les gens visent naturellement un peu plus bas. On compense
// en "remontant" virtuellement le point de contact de quelques pixels.
const FINGER_OFFSET_Y = -18

// Marge de tolérance ajoutée à la largeur du chemin pour absorber l'imprécision tactile
// normale d'un doigt (par opposition à un curseur de souris précis au pixel).
const TOUCH_TOLERANCE_PX = 22

export default function PathGame({ config, effects, onComplete }) {
  const { segments, width, timeLimit } = config
  const points = useMemo(() => generatePath(segments), [])
  const svgRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [trail, setTrail] = useState([])
  const [status, setStatus] = useState('playing') // playing | success | fail
  const finishedRef = useRef(false)

  const start = points[0]
  const end = points[points.length - 1]

  function getSvgPoint(clientX, clientY) {
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    const scaleX = 300 / rect.width
    const scaleY = 480 / rect.height
    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY + FINGER_OFFSET_Y * scaleY
    return { x, y }
  }

  function handleStart(e) {
    if (status !== 'playing') return
    const touch = e.touches ? e.touches[0] : e
    const p = getSvgPoint(touch.clientX, touch.clientY)
    // Zone de départ généreuse : le joueur doit juste être "dans le coin" du point A
    if (Math.hypot(p.x - start.x, p.y - start.y) < 55) {
      setDragging(true)
      setTrail([start]) // on démarre proprement depuis le centre du point A
    }
  }

  function handleMove(e) {
    if (!dragging || status !== 'playing') return
    const touch = e.touches ? e.touches[0] : e
    let p = getSvgPoint(touch.clientX, touch.clientY)

    const dist = minDistToPath(p, points)
    const tolerance = width / 2 + TOUCH_TOLERANCE_PX

    if (dist > tolerance) {
      finish(false)
      return
    }

    setTrail(prev => [...prev, p])

    const distToEnd = Math.hypot(p.x - end.x, p.y - end.y)
    if (distToEnd < 38) {
      finish(true)
    }
  }

  function handleEnd() {
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

  // Timer plus généreux + accélération drunk plafonnée pour rester jouable même en chaos
  const effectiveTimeMs = (timeLimit + 2) * 1000
  const cappedSpeedMultiplier = Math.min(effects.timerSpeedMultiplier, 1.25)

  return (
    <div className="col" style={{ height: '100%', padding: '0 16px 16px' }}>
      <div style={{ marginBottom: 10 }}>
        <CountdownBar
          durationMs={effectiveTimeMs}
          speedMultiplier={cappedSpeedMultiplier}
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
