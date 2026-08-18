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

export default function PlayingScreen() {
  const { currentLevel, currentPlayer, dispatch, drunkIntensity, state } = useGame()
  const lang = state.language || 'fr'
  const t = UI_TEXT[lang]

  if (!currentLevel || !currentPlayer) return null

  const GameComponent = GAME_COMPONENTS[currentLevel.type]
  const effects = getDrunkEffects(drunkIntensity)

  function handleComplete({ success, scoreDelta, message }) {
    dispatch({ type: 'SUBMIT_RESULT', success, scoreDelta, message })
  }

  // Le flou et le tremblement s'appliquent directement au conteneur interactif (n'affectent
  // pas les coordonnées tactiles). Le retournement 180° est volontairement appliqué à TOUT
  // le conteneur y compris les zones tactiles : c'est le but recherché (le joueur doit
  // s'adapter à un écran retourné), pas un bug — mais on ne l'applique qu'en overlay non
  // interactif pour les mini-jeux qui reposent sur un tracé précis, où un flip briserait
  // complètement la jouabilité plutôt que de créer un vrai défi.
  const stageClassName = getStageClassName(effects)
  const stageStyle = getStageStyle(effects)

  return (
    <div className="screen fade-in" style={{ background: 'var(--void)' }}>
      <div className="screen-pad col" style={{ gap: 12, paddingBottom: 8 }}>
        <div className="row spread">
          <div className="col" style={{ gap: 2 }}>
            <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{t.turnOf}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{currentPlayer.name}</span>
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
