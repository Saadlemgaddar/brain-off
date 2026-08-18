import { useRef, useState } from 'react'
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

// Score de similarité: distance moyenne du tracé utilisateur aux points de référence.
// Tolérance encore élargie par rapport à la version précédente (85 -> 110) : un tracé
// au doigt reste naturellement imprécis, mieux vaut valider trop large que trop strict.
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
  const score = Math.max(0, Math.min(100, Math.round(100 - (avgDist / 110) * 100)))
  return score
}

export default function ShapeGame({ config, effects, onComplete }) {
  const { shape, timeLimit } = config
  const refPoints = useRef(SHAPES[shape]()).current
  const svgRef = useRef(null)
  const [userTrail, setUserTrail] = useState([])
  const [drawing, setDrawing] = useState(false)
  const [status, setStatus] = useState('playing')
  const finishedRef = useRef(false)

  // Calcule le point SVG à partir des coordonnées écran, en tenant compte du VRAI ratio
  // largeur/hauteur affiché (le SVG est carré à l'écran via aspectRatio CSS, donc rect.width
  // et rect.height sont égaux — plus de désalignement possible entre les deux axes).
  function getSvgPoint(clientX, clientY) {
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    // Compense le fait que le doigt cache le tracé : décalage vertical vers le haut
    const fingerOffsetY = -12
    const scale = 200 / rect.width // rect.width === rect.height car le conteneur est forcé carré
    const x = (clientX - rect.left) * scale
    const y = (clientY - rect.top) * scale + fingerOffsetY
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
    const p = getSvgPoint(touch.clientX, touch.clientY)
    setUserTrail(prev => [...prev, p])
  }

  function handleEnd() {
    setDrawing(false)
  }

  function finish() {
    if (finishedRef.current) return
    finishedRef.current = true
    const score = scoreDrawing(userTrail, refPoints)
    const success = score >= 30
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

  // Timer plus généreux + accélération drunk plafonnée
  const effectiveTimeMs = (timeLimit + 2) * 1000
  const cappedSpeedMultiplier = Math.min(effects.timerSpeedMultiplier, 1.25)

  // Ce mini-jeu n'utilise QUE le flou en mode chaos — pas de rotation, pas de tremblement,
  // pas de disparition progressive. Le tracé précis nécessite un rendu stable.
  const blurAmount = effects.blurPx > 0.1 ? `blur(${effects.blurPx}px)` : 'none'

  return (
    <div className="col" style={{ height: '100%', padding: '0 16px 16px' }}>
      <div style={{ marginBottom: 10 }}>
        <CountdownBar
          durationMs={effectiveTimeMs}
          speedMultiplier={cappedSpeedMultiplier}
          onExpire={handleTimeout}
        />
      </div>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-dim)', marginBottom: 4 }}>
        ✍️ Reproduis la forme {SHAPE_EMOJI[shape]}
      </p>

      <div className="grow center" style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 200 200"
          style={{
            width: '90%',
            maxWidth: 320,
            aspectRatio: '1 / 1',
            touchAction: 'none',
            filter: blurAmount,
          }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          <path
            d={pointsToPath(refPoints, shape !== 'zigzag')}
            stroke="var(--surface-hi)"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
