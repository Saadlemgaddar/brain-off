import { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'
import { UI_TEXT } from '../utils/i18n'
import { speak } from '../utils/voice'
import { GIFS } from '../utils/media'

const MEDALS_ALCOHOL = ['🥇', '🥈', '🥉', '🍺', '🍺', '🍺', '🍺', '🍺']
const MEDALS_CLEAN = ['🥇', '🥈', '🥉', '🎯', '🎯', '🎯', '🎯', '🎯']

export default function LeaderboardScreen() {
  const { state, dispatch } = useGame()
  const t = UI_TEXT[state.language || 'fr']
  const lang = state.language || 'fr'
  const sorted = [...state.players].sort((a, b) => b.score - a.score)
  const MEDALS = state.alcoholMode ? MEDALS_ALCOHOL : MEDALS_CLEAN
  const lastPlacePlayer = sorted.length > 1 ? sorted[sorted.length - 1] : null
  const lastPlaceTitle = state.alcoholMode ? t.lastPlaceTitle : t.lastPlaceTitleClean
  const spokenRef = useRef(false)

  useEffect(() => {
    if (spokenRef.current || !state.voiceEnabled || !lastPlacePlayer) return
    spokenRef.current = true
    speak(`${lastPlacePlayer.name}. ${lastPlaceTitle}`, lang)
  }, [])

  return (
    <div className="screen screen-pad fade-in" style={{ overflowY: 'auto' }}>
      <div className="col center" style={{ gap: 4, marginBottom: 20, marginTop: 12 }}>
        <div style={{ fontSize: 44 }}>🏆</div>
        <h1 style={{ fontSize: 26, textAlign: 'center' }}>{t.finalRanking}</h1>
        <p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{t.partyOver}</p>
      </div>

      {lastPlacePlayer && (
        <div
          className="pop-in col center"
          style={{
            gap: 6,
            marginBottom: 24,
            padding: '18px 20px',
            background: 'linear-gradient(135deg, rgba(255,63,109,0.18), var(--surface))',
            border: '2px solid var(--wasted)',
            borderRadius: 18,
            animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both, shake 0.5s ease 0.4s',
          }}
        >
          <img
            src={GIFS.mostDrunk}
            alt=""
            style={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: 16,
              border: '2px solid var(--wasted)',
            }}
          />
          <p style={{ fontSize: 11, color: 'var(--wasted)', fontWeight: 700, letterSpacing: '0.05em', textAlign: 'center', marginTop: 4 }}>
            {lastPlaceTitle}
          </p>
          <p style={{ fontSize: 20, fontFamily: 'var(--font-display)', textAlign: 'center' }}>
            {lastPlacePlayer.name}
          </p>
        </div>
      )}

      <div className="col" style={{ gap: 10 }}>
        {sorted.map((p, i) => (
          <div
            key={p.id}
            className="row spread pop-in"
            style={{
              background: i === 0 ? 'linear-gradient(90deg, rgba(212,255,63,0.15), var(--surface))' : 'var(--surface)',
              border: i === 0 ? '2px solid var(--acid)' : i === sorted.length - 1 && sorted.length > 1 ? '2px solid var(--wasted)' : '2px solid transparent',
              borderRadius: 16,
              padding: '16px 18px',
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div className="row" style={{ gap: 12 }}>
              <span style={{ fontSize: 22 }}>{MEDALS[i] || (state.alcoholMode ? '🍺' : '🎯')}</span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</span>
            </div>
            <span style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: i === 0 ? 'var(--acid)' : 'var(--ink)' }}>
              {p.score}
            </span>
          </div>
        ))}
      </div>

      <div className="grow" />

      <div className="col" style={{ gap: 12, paddingTop: 20 }}>
        <button className="btn btn-primary" onClick={() => dispatch({ type: 'RESTART_PARTY' })}>
          {t.replay}
        </button>
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_HOME' })}>
          {t.mainMenu}
        </button>
      </div>
    </div>
  )
}
