import { ArrowLeft } from 'lucide-react';

interface AnswerViewProps {
  solution: number[][];
  userGrid: (number | null)[][];
  initialGrid: (number | null)[][];
  onBack: () => void;
}

export default function AnswerView({ solution, userGrid, initialGrid, onBack }: AnswerViewProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-sky-500 text-white p-4 flex items-center">
        <button onClick={onBack} className="p-2 hover:bg-sky-600 rounded-lg transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="ml-4 text-xl font-bold">Đáp án</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <div className="grid grid-cols-9 gap-0 border-4 border-sky-500 rounded-lg overflow-hidden">
            {solution.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isInitial = initialGrid[rowIndex][colIndex] !== null;
                const wasWrong = userGrid[rowIndex][colIndex] !== null &&
                                userGrid[rowIndex][colIndex] !== solution[rowIndex][colIndex];
                const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8;
                const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      w-12 h-12 flex items-center justify-center text-lg
                      ${isInitial ? 'bg-white font-bold' : wasWrong ? 'bg-red-100 text-green-600 font-bold' : 'bg-green-50 text-green-600'}
                      ${isRightBorder ? 'border-r-2 border-sky-500' : 'border-r border-gray-300'}
                      ${isBottomBorder ? 'border-b-2 border-sky-500' : 'border-b border-gray-300'}
                    `}
                  >
                    {cell}
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white border-2 border-gray-300"></div>
              <span>Số ban đầu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-50"></div>
              <span>Đáp án đúng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100"></div>
              <span>Ô bạn điền sai</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
