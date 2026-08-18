import { useGame } from '../context/GameContext'
import { UI_TEXT } from '../utils/i18n'

export default function AgeCheckScreen() {
  const { state, dispatch } = useGame()
  const t = UI_TEXT[state.language || 'fr']

  function answer(isAdult) {
    dispatch({ type: 'SET_AGE_CHECK', isAdult })
  }

  return (
    <div className="screen screen-pad fade-in center" style={{ background: 'radial-gradient(ellipse at top, #1C1C2B 0%, #0B0B14 60%)' }}>
      <div className="col center" style={{ gap: 24, width: '100%' }}>
        <div style={{ fontSize: 44 }}>🔞</div>
        <div className="col center" style={{ gap: 6 }}>
          <h2 style={{ fontSize: 22, textAlign: 'center' }}>{t.ageCheckTitle}</h2>
          <p style={{ fontSize: 15, color: 'var(--ink-dim)', textAlign: 'center' }}>{t.ageCheckSubtitle}</p>
        </div>

        <div className="col" style={{ gap: 14, width: '100%', maxWidth: 340 }}>
          <button
            onClick={() => answer(true)}
            className="btn btn-primary"
            style={{ padding: 20 }}
          >
            {t.ageCheckYes}
          </button>
          <button
            onClick={() => answer(false)}
            className="btn btn-ghost"
            style={{ padding: 20 }}
          >
            {t.ageCheckNo}
          </button>
        </div>
      </div>
    </div>
  )
}
