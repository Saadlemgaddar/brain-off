import { useGame } from '../context/GameContext'
import DrunkMeter from './DrunkMeter'
import { getDrunkEffects, getStageClassName, getStageStyle } from '../utils/drunkEffects'
import { UI_TEXT } from '../utils/i18n'

import PathGame from '../games/PathGame'
import ShapeGame from '../games/ShapeGame'
import MemoryGame from '../games/MemoryGame'
import AimGame from '../games/AimGame'
import MathGame from '../games/MathGame'
import OddOneOutGame from '../games/OddOneOutGame'
import ReflexGame from '../games/ReflexGame'
import TrapButtonGame from '../games/TrapButtonGame'
import TrapNoTouchGame from '../games/TrapNoTouchGame'

const GAME_COMPONENTS = {
  path: PathGame,
  shape: ShapeGame,
  memory: MemoryGame,
  aim: AimGame,
  math: MathGame,
  oddOneOut: OddOneOutGame,
  reflex: ReflexGame,
  trapButton: TrapButtonGame,
  trapNoTouch: TrapNoTouchGame,
}

// Mini-jeux dont la jouabilité repose sur un tracé précis au doigt : le retournement 180°
// et le tremblement d'écran y sont désactivés (rendraient le dessin illisible/impossible à
// suivre), seul le flou reste actif pour garder un peu de chaos visuel sans casser le jeu.
const PRECISION_DRAWING_TYPES = new Set(['shape'])

export default function PlayingScreen() {
  const { currentLevel, currentPlayer, dispatch, drunkIntensity, state } = useGame()
  const lang = state.language || 'fr'
  const t = UI_TEXT[lang]

  if (!currentLevel || !currentPlayer) return null

  const GameComponent = GAME_COMPONENTS[currentLevel.type]
  const rawEffects = getDrunkEffects(drunkIntensity)
  const isPrecisionGame = PRECISION_DRAWING_TYPES.has(currentLevel.type)

  // Pour les jeux de tracé précis : on ne garde que le flou, tout le reste (flip, shake)
  // est neutralisé au niveau des effets transmis au conteneur ET au composant.
  const effects = isPrecisionGame
    ? { ...rawEffects, flipEnabled: false, screenShake: false }
    : rawEffects

  function handleComplete({ success, scoreDelta, message }) {
    dispatch({ type: 'SUBMIT_RESULT', success, scoreDelta, message })
  }

  // Le flou et le tremblement s'appliquent directement au conteneur interactif (n'affectent
  // pas les coordonnées tactiles). Le retournement 180° est volontairement appliqué à TOUT
  // le conteneur y compris les zones tactiles : c'est le but recherché (le joueur doit
  // s'adapter à un écran retourné), pas un bug — sauf pour les jeux de tracé précis
  // (cf. PRECISION_DRAWING_TYPES) où flip et shake sont désactivés en amont.
  const stageClassName = getStageClassName(effects)
  const stageStyle = getStageStyle(effects)

  return (
    <div className="screen fade-in" style={{ background: 'var(--void)' }}>
      <div className="screen-pad col" style={{ gap: 12, paddingBottom: 8 }}>
        <div className="row spread">
          <div className="col" style={{ gap: 2 }}>
            {state.isTestMode ? (
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>
                {state.currentLevelIndex + 1} / 5
              </span>
            ) : (
              <>
                <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{t.turnOf}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{currentPlayer.name}</span>
              </>
            )}
          </div>
          <DrunkMeter compact />
        </div>
      </div>

      <div
        className={`grow ${stageClassName}`}
        style={{ position: 'relative', overflow: 'hidden', ...stageStyle }}
      >
        <GameComponent
          key={currentLevel.id + '-' + state.currentLevelIndex}
          config={currentLevel.config}
          effects={effects}
          onComplete={handleComplete}
          alcoholMode={!!state.alcoholMode}
        />
      </div>
    </div>
  )
}
