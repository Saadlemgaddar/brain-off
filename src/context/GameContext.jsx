import { createContext, useContext, useReducer, useCallback } from 'react'
import { LEVELS } from '../utils/levels'

const GameContext = createContext(null)

const DRUNK_STAGES = [
  { key: 'sober', label: 'SOBER', emoji: '🧠', threshold: 0 },
  { key: 'tipsy', label: 'TIPSY', emoji: '😏', threshold: 25 },
  { key: 'drunk', label: 'DRUNK', emoji: '🍺', threshold: 50 },
  { key: 'wasted', label: 'WASTED', emoji: '🥴', threshold: 75 },
  { key: 'final', label: 'FINAL BOSS', emoji: '💀', threshold: 100 },
]

function getDrunkStage(pct) {
  let stage = DRUNK_STAGES[0]
  for (const s of DRUNK_STAGES) {
    if (pct >= s.threshold) stage = s
  }
  return stage
}

const initialState = {
  screen: 'home', // home | setup | playing | result | leaderboard | settings
  mode: 'solo', // solo | party
  drunkModeEnabled: true, // le joueur peut choisir d'activer le chaos
  manualDrunkLevel: null, // si défini, l'utilisateur pilote le % lui-même (0-100)
  players: [], // [{ id, name, score, roundsPlayed, worstResult }]
  currentPlayerIndex: 0,
  currentLevelIndex: 0,
  levelQueue: [], // séquence d'indices dans LEVELS pour cette partie
  roundsPerPlayer: 5,
  lastResult: null, // { success, scoreDelta, message }
  sessionDrunkPct: 0, // progression auto au fil de la soirée (si pas de manualDrunkLevel)
}

function reducer(state, action) {
  switch (action.type) {
    case 'GO_HOME':
      return { ...initialState }

    case 'GO_SETUP':
      return { ...state, screen: 'setup', mode: action.mode }

    case 'SET_DRUNK_TOGGLE':
      return { ...state, drunkModeEnabled: action.value }

    case 'START_GAME': {
      const { players, roundsPerPlayer } = action
      const totalRounds = players.length * roundsPerPlayer
      const queue = buildLevelQueue(totalRounds)
      return {
        ...state,
        screen: 'playing',
        players: players.map((p, i) => ({
          id: i,
          name: p,
          score: 0,
          roundsPlayed: 0,
          worstResult: null,
        })),
        roundsPerPlayer,
        levelQueue: queue,
        currentLevelIndex: 0,
        currentPlayerIndex: 0,
        sessionDrunkPct: 0,
        manualDrunkLevel: state.manualDrunkLevel,
      }
    }

    case 'SET_MANUAL_DRUNK':
      return { ...state, manualDrunkLevel: action.value }

    case 'SUBMIT_RESULT': {
      const { success, scoreDelta, message } = action
      const players = [...state.players]
      const p = { ...players[state.currentPlayerIndex] }
      p.score += scoreDelta
      p.roundsPlayed += 1
      if (!success) {
        p.worstResult = message
      }
      players[state.currentPlayerIndex] = p

      const totalRounds = players.length * state.roundsPerPlayer
      const roundsDone = state.currentLevelIndex + 1
      const newDrunkPct = state.manualDrunkLevel !== null
        ? state.manualDrunkLevel
        : Math.min(100, Math.round((roundsDone / totalRounds) * 100))

      return {
        ...state,
        screen: 'result',
        players,
        lastResult: { success, scoreDelta, message },
        sessionDrunkPct: newDrunkPct,
      }
    }

    case 'NEXT_ROUND': {
      const totalRounds = state.players.length * state.roundsPerPlayer
      const nextLevelIndex = state.currentLevelIndex + 1
      if (nextLevelIndex >= totalRounds) {
        return { ...state, screen: 'leaderboard' }
      }
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length
      return {
        ...state,
        screen: 'playing',
        currentLevelIndex: nextLevelIndex,
        currentPlayerIndex: nextPlayerIndex,
        lastResult: null,
      }
    }

    case 'RESTART_PARTY': {
      const players = state.players.map(p => ({ ...p, score: 0, roundsPlayed: 0, worstResult: null }))
      const totalRounds = players.length * state.roundsPerPlayer
      return {
        ...state,
        screen: 'playing',
        players,
        levelQueue: buildLevelQueue(totalRounds),
        currentLevelIndex: 0,
        currentPlayerIndex: 0,
        sessionDrunkPct: 0,
        lastResult: null,
      }
    }

    default:
      return state
  }
}

function buildLevelQueue(totalRounds) {
  // Mélange pondéré: on parcourt LEVELS de façon cyclique en les mélangeant par paquets
  // pour garantir une bonne diversité sans trop de répétition consécutive du même mini-jeu type.
  const pool = [...LEVELS]
  const queue = []
  let lastType = null
  let safety = 0
  while (queue.length < totalRounds && safety < 5000) {
    safety++
    const idx = Math.floor(Math.random() * pool.length)
    const candidate = pool[idx]
    if (candidate.type === lastType && pool.length > 1) continue
    queue.push(idx)
    lastType = candidate.type
  }
  while (queue.length < totalRounds) {
    queue.push(Math.floor(Math.random() * pool.length))
  }
  return queue
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const currentLevel = state.levelQueue.length
    ? LEVELS[state.levelQueue[state.currentLevelIndex]]
    : null

  const currentPlayer = state.players[state.currentPlayerIndex] || null

  const drunkPct = state.manualDrunkLevel !== null ? state.manualDrunkLevel : state.sessionDrunkPct
  const drunkStage = getDrunkStage(state.drunkModeEnabled ? drunkPct : 0)
  const drunkIntensity = state.drunkModeEnabled ? drunkPct / 100 : 0

  const value = {
    state,
    dispatch,
    currentLevel,
    currentPlayer,
    drunkPct,
    drunkStage,
    drunkIntensity,
    DRUNK_STAGES,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
