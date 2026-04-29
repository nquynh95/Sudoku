import { X } from 'lucide-react';

interface LoseScreenProps {
  reason: string;
  onViewAnswer: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export default function LoseScreen({ reason, onViewAnswer, onReplay, onHome }: LoseScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-16 h-16 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Thất bại!</h1>
          <p className="text-gray-600">{reason}</p>
        </div>

        <div className="bg-red-50 rounded-xl p-6 mb-8">
          <p className="text-gray-700">
            Đừng lo! Mỗi thất bại là một bài học. Hãy xem đáp án để hiểu rõ hơn và thử lại nhé!
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onViewAnswer}
            className="w-full py-4 px-6 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition font-bold text-lg"
          >
            Xem đáp án
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
