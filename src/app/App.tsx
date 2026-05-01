import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import SudokuGame from './components/SudokuGame';
import { SavedGame } from './components/SudokuGame';
import WinScreen from './components/WinScreen';
import LoseScreen from './components/LoseScreen';
import AnswerView from './components/AnswerView';

type Screen = 'home' | 'game' | 'win' | 'lose' | 'answer';

interface GameStats {
  time: number;
  errors: number;
  hintsUsed: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameStats, setGameStats] = useState<GameStats>({ time: 0, errors: 0, hintsUsed: 0 });
  const [stats, setStats] = useState({
    wins: 0,
    bestTime: 0,
    currentStreak: 0
  });
  const [solution, setSolution] = useState<number[][]>([]);
  const [userGrid, setUserGrid] = useState<(number | null)[][]>([]);
  const [initialGrid, setInitialGrid] = useState<(number | null)[][]>([]);
  const [loseReason, setLoseReason] = useState<string>('Bạn đã hết lượt sai');
  const [savedGame, setSavedGame] = useState<SavedGame | null>(null);

  const handleStartGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setSavedGame(null);
    setCurrentScreen('game');
  };

  const handleContinue = () => {
    if (savedGame) {
      setDifficulty(savedGame.difficulty);
      setCurrentScreen('game');
    }
  };

  const handleWin = (stats: GameStats, sol: number[][], uGrid: (number | null)[][], iGrid: (number | null)[][]) => {
    setGameStats(stats);
    setSolution(sol);
    setUserGrid(uGrid);
    setInitialGrid(iGrid);
    setStats(prev => ({
      wins: prev.wins + 1,
      bestTime: prev.bestTime === 0 ? stats.time : Math.min(prev.bestTime, stats.time),
      currentStreak: prev.currentStreak + 1
    }));
    setSavedGame(null);
    setCurrentScreen('win');
  };

  const handleLose = (sol: number[][], uGrid: (number | null)[][], iGrid: (number | null)[][], reason?: string) => {
    setSolution(sol);
    setUserGrid(uGrid);
    setInitialGrid(iGrid);
    setLoseReason(reason || 'Bạn đã hết lượt sai');
    setStats(prev => ({
      ...prev,
      currentStreak: 0
    }));
    setSavedGame(null);
    setCurrentScreen('lose');
  };

  const handleNextGame = () => {
    setSavedGame(null);
    setCurrentScreen('game');
  };

  const handleReplay = () => {
    setSavedGame(null);
    setCurrentScreen('game');
  };

  const handleHome = () => {
    setCurrentScreen('home');
  };

  const handleViewAnswer = () => {
    setCurrentScreen('answer');
  };

  return (
    <div className="size-full">
      {currentScreen === 'home' && (
        <HomeScreen
          onStartGame={handleStartGame}
          onContinue={handleContinue}
          stats={stats}
          hasSavedGame={savedGame !== null}
        />
      )}
      {currentScreen === 'game' && (
        <SudokuGame
          difficulty={difficulty}
          onBack={handleHome}
          onWin={handleWin}
          onLose={handleLose}
          savedGame={savedGame}
          onSaveGame={setSavedGame}
        />
      )}
      {currentScreen === 'win' && (
        <WinScreen
          time={gameStats.time}
          errors={gameStats.errors}
          hintsUsed={gameStats.hintsUsed}
          onNextGame={handleNextGame}
          onReplay={handleReplay}
          onHome={handleHome}
        />
      )}
      {currentScreen === 'lose' && (
        <LoseScreen
          reason={loseReason}
          onViewAnswer={handleViewAnswer}
          onReplay={handleReplay}
          onHome={handleHome}
        />
      )}
      {currentScreen === 'answer' && (
        <AnswerView
          solution={solution}
          userGrid={userGrid}
          initialGrid={initialGrid}
          onBack={handleHome}
        />
      )}
    </div>
  );
}