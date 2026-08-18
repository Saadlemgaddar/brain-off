import { GameProvider, useGame } from './context/GameContext'
import IntroScreen from './components/IntroScreen'
import AgeCheckScreen from './components/AgeCheckScreen'
import ModeCheckScreen from './components/ModeCheckScreen'
import ResponsibleDrinkingScreen from './components/ResponsibleDrinkingScreen'
import HomeScreen from './components/HomeScreen'
import SettingsScreen from './components/SettingsScreen'
import SetupScreen from './components/SetupScreen'
import ReadyScreen from './components/ReadyScreen'
import PlayingScreen from './components/PlayingScreen'
import ResultScreen from './components/ResultScreen'
import TestResultScreen from './components/TestResultScreen'
import LeaderboardScreen from './components/LeaderboardScreen'

function Router() {
  const { state } = useGame()

  switch (state.screen) {
    case 'intro':
      return <IntroScreen />
    case 'ageCheck':
      return <AgeCheckScreen />
    case 'modeCheck':
      return <ModeCheckScreen />
    case 'responsibleDrinkingNotice':
      return <ResponsibleDrinkingScreen />
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
    case 'testResult':
      return <TestResultScreen />
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
