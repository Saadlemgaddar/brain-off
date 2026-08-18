import { createContext, useContext, useReducer } from 'react'
import { LEVELS } from '../utils/levels'

const GameContext = createContext(null)

// Deux jeux de libellés pour la jauge de chaos : avec alcool (thème original) et neutre (sans alcool).
const DRUNK_STAGES_ALCOHOL = [
  { key: 'sober', label: 'SOBER', emoji: '🧠', threshold: 0 },
  { key: 'tipsy', label: 'TIPSY', emoji: '😏', threshold: 25 },
  { key: 'drunk', label: 'DRUNK', emoji: '🍺', threshold: 50 },
  { key: 'wasted', label: 'WASTED', emoji: '🥴', threshold: 75 },
  { key: 'final', label: 'FINAL BOSS', emoji: '💀', threshold: 100 },
]

const DRUNK_STAGES_CLEAN = [
  { key: 'sober', label: 'FOCUS', emoji: '🧠', threshold: 0 },
  { key: 'tipsy', label: 'WOBBLY', emoji: '😏', threshold: 25 },
  { key: 'drunk', label: 'CHAOS', emoji: '🌀', threshold: 50 },
  { key: 'wasted', label: 'MELTDOWN', emoji: '🥴', threshold: 75 },
  { key: 'final', label: 'FINAL BOSS', emoji: '💀', threshold: 100 },
]

function getDrunkStages(alcoholMode) {
  return alcoholMode ? DRUNK_STAGES_ALCOHOL : DRUNK_STAGES_CLEAN
}

function getDrunkStage(pct, alcoholMode) {
  const stages = getDrunkStages(alcoholMode)
  let stage = stages[0]
  for (const s of stages) {
    if (pct >= s.threshold) stage = s
  }
  return stage
}

const initialState = {
  screen: 'intro', // intro | home | setup | playing | ready | result | leaderboard
  mode: 'solo', // solo | party
  language: null, // 'fr' | 'en' | 'darija' — choisi à l'écran intro, modifiable depuis le menu
  alcoholMode: null, // true | false — choisi à l'écran intro, modifiable depuis le menu
  voiceEnabled: true,
  drunkModeEnabled: true,
  manualDrunkLevel: null,
  players: [],
  currentPlayerIndex: 0,
  currentLevelIndex: 0,
  levelQueue: [],
  roundsPerPlayer: 5,
  lastResult: null, // { success, scoreDelta, message, drinkTargetName, isSelfDrink }
  sessionDrunkPct: 0,
}

// Choisit qui doit boire selon le résultat :
// - victoire -> un autre joueur au hasard (le gagnant "distribue" une gorgée)
// - défaite -> le joueur lui-même
// En solo (un seul joueur), il n'y a personne d'autre à désigner : il boit dans tous les cas.
function pickDrinkTarget(players, currentPlayerIndex, success) {
  const currentPlayer = players[currentPlayerIndex]
  if (!success || players.length < 2) {
    return { name: currentPlayer.name, isSelf: true }
  }
  const others = players.filter((_, i) => i !== currentPlayerIndex)
  const target = others[Math.floor(Math.random() * others.length)]
  return { name: target.name, isSelf: false }
}

function reducer(state, action) {
  switch (action.type) {
    case 'GO_HOME':
      return { ...initialState, language: state.language, alcoholMode: state.alcoholMode, voiceEnabled: state.voiceEnabled, screen: 'home' }

    case 'SET_INTRO_CHOICES':
      return { ...state, language: action.language, alcoholMode: action.alcoholMode, screen: 'home' }

    case 'SET_LANGUAGE':
      return { ...state, language: action.value }

    case 'SET_ALCOHOL_MODE':
      return { ...state, alcoholMode: action.value }

    case 'SET_VOICE_TOGGLE':
      return { ...state, voiceEnabled: action.value }

    case 'GO_SETUP':
      return { ...state, screen: 'setup', mode: action.mode }

    case 'GO_SETTINGS':
      return { ...state, screen: 'settings' }

    case 'SET_DRUNK_TOGGLE':
      return { ...state, drunkModeEnabled: action.value }

    case 'START_GAME': {
      const { players, roundsPerPlayer } = action
      const totalRounds = players.length * roundsPerPlayer
      const queue = buildLevelQueue(totalRounds)
      return {
        ...state,
        screen: 'ready', // on attend la confirmation du joueur avant le tout premier défi aussi
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

    // Le joueur a confirmé qu'il est prêt sur l'écran "ready" -> on lance vraiment le défi
    case 'CONFIRM_READY':
      return { ...state, screen: 'playing' }

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

      const drinkTarget = state.alcoholMode
        ? pickDrinkTarget(players, state.currentPlayerIndex, success)
        : null

      return {
        ...state,
        screen: 'result',
        players,
        lastResult: {
          success,
          scoreDelta,
          message,
          drinkTargetName: drinkTarget?.name || null,
          isSelfDrink: drinkTarget?.isSelf ?? null,
        },
        sessionDrunkPct: newDrunkPct,
      }
    }

    // Après le résultat, on ne relance pas directement le défi suivant : on repasse
    // par l'écran "ready" pour laisser le prochain joueur confirmer qu'il est prêt.
    case 'NEXT_ROUND': {
      const totalRounds = state.players.length * state.roundsPerPlayer
      const nextLevelIndex = state.currentLevelIndex + 1
      if (nextLevelIndex >= totalRounds) {
        return { ...state, screen: 'leaderboard' }
      }
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length
      return {
        ...state,
        screen: 'ready',
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
        screen: 'ready',
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
  const drunkStages = getDrunkStages(state.alcoholMode)
  const drunkStage = getDrunkStage(state.drunkModeEnabled ? drunkPct : 0, state.alcoholMode)
  const drunkIntensity = state.drunkModeEnabled ? drunkPct / 100 : 0

  const value = {
    state,
    dispatch,
    currentLevel,
    currentPlayer,
    drunkPct,
    drunkStage,
    drunkIntensity,
    drunkStages,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
