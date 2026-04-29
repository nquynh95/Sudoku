import { Trophy, Star } from 'lucide-react';

interface WinScreenProps {
  time: number;
  errors: number;
  hintsUsed: number;
  onNextGame: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export default function WinScreen({ time, errors, hintsUsed, onNextGame, onReplay, onHome }: WinScreenProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStars = (): number => {
    if (time <= 480 && hintsUsed <= 1 && errors <= 1) return 3;
    if (time <= 720 && hintsUsed <= 2 && errors <= 3) return 2;
    return 1;
  };

  const stars = getStars();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Xuất sắc!</h1>
          <p className="text-gray-600">Bạn đã hoàn thành Sudoku</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`w-12 h-12 ${
                star <= stars
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300 fill-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="bg-sky-50 rounded-xl p-6 mb-8 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Thời gian</span>
            <span className="text-2xl font-bold text-sky-600">{formatTime(time)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số lỗi</span>
            <span className="text-2xl font-bold text-sky-600">{errors}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Gợi ý đã dùng</span>
            <span className="text-2xl font-bold text-sky-600">{hintsUsed}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onNextGame}
            className="w-full py-4 px-6 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition font-bold text-lg"
          >
            Ván tiếp theo
          </button>
          <button
            onClick={onReplay}
            className="w-full py-4 px-6 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-bold text-lg"
          >
            Chơi lại
          </button>
          <button
            onClick={onHome}
            className="w-full py-4 px-6 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold text-lg"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
