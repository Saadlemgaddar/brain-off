import { GameProvider, useGame } from './context/GameContext'
import IntroScreen from './components/IntroScreen'
import HomeScreen from './components/HomeScreen'
import SettingsScreen from './components/SettingsScreen'
import SetupScreen from './components/SetupScreen'
import ReadyScreen from './components/ReadyScreen'
import PlayingScreen from './components/PlayingScreen'
import ResultScreen from './components/ResultScreen'
import LeaderboardScreen from './components/LeaderboardScreen'

function Router() {
  const { state } = useGame()

  switch (state.screen) {
    case 'intro':
      return <IntroScreen />
    case 'home':
      return <HomeScreen />
    case 'settings':
      return <SettingsScreen />
    case 'setup':
      return <SetupScreen />
    case 'ready':
      return <ReadyScreen />
    case 'playing':
      return <PlayingScreen />
    case 'result':
      return <ResultScreen />
    case 'leaderboard':
      return <LeaderboardScreen />
    default:
      return <IntroScreen />
  }
}

export default function App() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  )
}
