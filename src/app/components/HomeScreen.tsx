import { TrendingUp } from 'lucide-react';

interface HomeScreenProps {
  onStartGame: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onContinue: () => void;
  stats: {
    wins: number;
    bestTime: number;
    currentStreak: number;
  };
  hasSavedGame: boolean;
}

export default function HomeScreen({ onStartGame, onContinue, stats, hasSavedGame }: HomeScreenProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-2">SUDOKU</h1>
          <p className="text-sky-100 text-lg">Thử thách trí tuệ của bạn</p>
        </div>

        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Chơi mới</h2>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => onStartGame('easy')}
                className="w-full py-4 px-6 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-bold text-lg"
              >
                Dễ
              </button>
              <button
                onClick={() => onStartGame('medium')}
                className="w-full py-4 px-6 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition font-bold text-lg"
              >
                Vừa
              </button>
              <button
                onClick={() => onStartGame('hard')}
                className="w-full py-4 px-6 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-bold text-lg"
              >
                Khó
              </button>
            </div>

            <button
              onClick={onContinue}
              disabled={!hasSavedGame}
              className={`w-full py-4 px-6 rounded-xl transition font-bold text-lg ${
                hasSavedGame
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Chơi tiếp ván cũ
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-sky-500" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Thống kê</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Số ván thắng</span>
                <span className="text-2xl font-bold text-sky-600">{stats.wins}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kỷ lục thời gian</span>
                <span className="text-2xl font-bold text-sky-600">
                  {stats.bestTime > 0 ? formatTime(stats.bestTime) : '--:--'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Chuỗi streak</span>
                <span className="text-2xl font-bold text-sky-600">{stats.currentStreak}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
