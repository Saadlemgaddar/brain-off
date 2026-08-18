import { useState } from 'react'
import { useGame } from '../context/GameContext'

export default function SetupScreen() {
  const { state, dispatch } = useGame()
  const isParty = state.mode === 'party'
  const [players, setPlayers] = useState(isParty ? ['', ''] : ['Toi'])
  const [rounds, setRounds] = useState(5)
  const [drunkOn, setDrunkOn] = useState(true)
  const [manualMode, setManualMode] = useState(false)
  const [manualPct, setManualPct] = useState(0)

  function updatePlayer(i, value) {
    const copy = [...players]
    copy[i] = value
    setPlayers(copy)
  }

  function addPlayer() {
    if (players.length >= 8) return
    setPlayers([...players, ''])
  }

  function removePlayer(i) {
    if (players.length <= (isParty ? 2 : 1)) return
    setPlayers(players.filter((_, idx) => idx !== i))
  }

  function canStart() {
    if (!isParty) return true
    return players.filter(p => p.trim().length > 0).length >= 2
  }

  function handleStart() {
    const names = isParty
      ? players.map(p => p.trim()).filter(Boolean)
      : ['Toi']
    dispatch({ type: 'SET_DRUNK_TOGGLE', value: drunkOn })
    dispatch({ type: 'SET_MANUAL_DRUNK', value: manualMode ? manualPct : null })
    dispatch({ type: 'START_GAME', players: names, roundsPerPlayer: rounds })
  }

  return (
    <div className="screen screen-pad fade-in" style={{ overflowY: 'auto' }}>
      <div className="row" style={{ marginBottom: 20 }}>
        <button className="btn-ghost" style={{ fontSize: 20, padding: 6 }} onClick={() => dispatch({ type: 'GO_HOME' })}>
          ←
        </button>
        <h2 style={{ fontSize: 20, marginLeft: 8 }}>
          {isParty ? '🎉 Mode soirée' : '🧍 Jouer seul'}
        </h2>
      </div>

      {isParty && (
        <div className="col" style={{ gap: 10, marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: 'var(--ink-dim)', fontWeight: 600, letterSpacing: '0.04em' }}>
            JOUEURS ({players.length}/8)
          </p>
          {players.map((p, i) => (
            <div key={i} className="row" style={{ gap: 8 }}>
              <input
                value={p}
                onChange={e => updatePlayer(i, e.target.value)}
                placeholder={`Joueur ${i + 1}`}
                maxLength={14}
                style={{
                  flex: 1,
                  background: 'var(--surface)',
                  border: '2px solid var(--surface-hi)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  color: 'var(--ink)',
                  fontSize: 15,
                  fontFamily: 'var(--font-body)',
                }}
              />
              {players.length > 2 && (
                <button
                  onClick={() => removePlayer(i)}
                  style={{ color: 'var(--ink-faint)', fontSize: 20, padding: 8 }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {players.length < 8 && (
            <button className="btn btn-ghost" style={{ padding: 12, fontSize: 13 }} onClick={addPlayer}>
              + Ajouter un joueur
            </button>
          )}
        </div>
      )}

      <div className="col" style={{ gap: 10, marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: 'var(--ink-dim)', fontWeight: 600, letterSpacing: '0.04em' }}>
          DÉFIS PAR JOUEUR
        </p>
        <div className="row" style={{ gap: 8 }}>
          {[3, 5, 8].map(r => (
            <button
              key={r}
              onClick={() => setRounds(r)}
              className="btn"
              style={{
                flex: 1,
                padding: 14,
                fontSize: 14,
                background: rounds === r ? 'var(--acid)' : 'var(--surface)',
                color: rounds === r ? 'var(--void)' : 'var(--ink)',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="col" style={{ gap: 12, marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: 'var(--ink-dim)', fontWeight: 600, letterSpacing: '0.04em' }}>
          MODE DRUNK
        </p>
        <button
          onClick={() => setDrunkOn(!drunkOn)}
          className="row spread"
          style={{
            background: 'var(--surface)',
            borderRadius: 16,
            padding: '14px 18px',
            border: `2px solid ${drunkOn ? 'var(--drunk)' : 'var(--surface-hi)'}`,
          }}
        >
          <div className="col" style={{ alignItems: 'flex-start', gap: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>🥴 Chaos progressif</span>
            <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
              L'écran devient de plus en plus ingérable
            </span>
          </div>
          <div
            style={{
              width: 44,
              height: 26,
              borderRadius: 999,
              background: drunkOn ? 'var(--drunk)' : 'var(--surface-hi)',
              position: 'relative',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'var(--ink)',
                position: 'absolute',
                top: 3,
                left: drunkOn ? 21 : 3,
                transition: 'left 0.2s',
              }}
            />
          </div>
        </button>

        {drunkOn && (
          <div className="col" style={{ gap: 10 }}>
            <button
              onClick={() => setManualMode(!manualMode)}
              className="row spread"
              style={{ padding: '10px 4px' }}
            >
              <span style={{ fontSize: 12, color: 'var(--ink-dim)' }}>
                Choisir manuellement le niveau plutôt qu'automatique
              </span>
              <span style={{ fontSize: 12, color: manualMode ? 'var(--acid)' : 'var(--ink-faint)' }}>
                {manualMode ? 'ON' : 'OFF'}
              </span>
            </button>
            {manualMode && (
              <input
                type="range"
                min="0"
                max="100"
                value={manualPct}
                onChange={e => setManualPct(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--drunk)' }}
              />
            )}
          </div>
        )}
      </div>

      <div className="grow" />

      <button
        className="btn btn-primary"
        disabled={!canStart()}
        onClick={handleStart}
        style={{ opacity: canStart() ? 1 : 0.4, marginTop: 12 }}
      >
        C'EST PARTI 🚀
      </button>
    </div>
  )
}
