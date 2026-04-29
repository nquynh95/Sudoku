import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Lightbulb, Undo, Eraser, PencilLine } from 'lucide-react';

type CellValue = number | null;
type NoteSet = Set<number>;

interface SudokuGameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onWin: (stats: GameStats, solution: number[][], userGrid: (number | null)[][], initialGrid: (number | null)[][]) => void;
  onLose: (solution: number[][], userGrid: (number | null)[][], initialGrid: (number | null)[][], reason?: string) => void;
}

interface GameStats {
  time: number;
  errors: number;
  hintsUsed: number;
}

export default function SudokuGame({ difficulty, onBack, onWin, onLose }: SudokuGameProps) {
  const [grid, setGrid] = useState<CellValue[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [initialGrid, setInitialGrid] = useState<CellValue[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<boolean[][]>([]);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [pencilMode, setPencilMode] = useState(false);
  const [notes, setNotes] = useState<NoteSet[][]>([]);
  const [history, setHistory] = useState<{grid: CellValue[][], notes: NoteSet[][]}[]>([]);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => {
        const newTime = t + 1;
        if (newTime >= 900) {
          onLose(solution, grid, initialGrid, 'Hết thời gian! Bạn chỉ có 15 phút để hoàn thành');
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [solution, grid, initialGrid, onLose]);

  useEffect(() => {
    if (lives <= 0) {
      onLose(solution, grid, initialGrid);
    }
  }, [lives, onLose]);

  useEffect(() => {
    if (isGameComplete()) {
      onWin({ time, errors: totalErrors, hintsUsed }, solution, grid, initialGrid);
    }
  }, [grid]);

  const initializeGame = () => {
    const newSolution = generateSudoku();
    const newGrid = createPuzzle(newSolution, difficulty);
    setSolution(newSolution);
    setGrid(newGrid);
    setInitialGrid(JSON.parse(JSON.stringify(newGrid)));
    setErrors(Array(9).fill(null).map(() => Array(9).fill(false)));
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set<number>())));
    setHistory([]);
    setLives(3);
    setTime(0);
    setHintsUsed(0);
    setTotalErrors(0);
  };

  const generateSudoku = (): number[][] => {
    const grid = Array(9).fill(null).map(() => Array(9).fill(0));
    fillGrid(grid);
    return grid;
  };

  const fillGrid = (grid: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (const num of numbers) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (fillGrid(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const isValid = (grid: number[][], row: number, col: number, num: number): boolean => {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  };

  const createPuzzle = (solution: number[][], difficulty: string): CellValue[][] => {
    const puzzle = JSON.parse(JSON.stringify(solution));
    const cellsToRemove = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 50 : 60;
    let removed = 0;
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null;
        removed++;
      }
    }
    return puzzle;
  };

  const saveHistory = () => {
    setHistory(prev => [...prev, {
      grid: JSON.parse(JSON.stringify(grid)),
      notes: notes.map(row => row.map(set => new Set(set)))
    }]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialGrid[row][col] !== null) return;

    saveHistory();

    if (pencilMode) {
      const newNotes = notes.map(row => row.map(set => new Set(set)));
      if (newNotes[row][col].has(num)) {
        newNotes[row][col].delete(num);
      } else {
        newNotes[row][col].add(num);
      }
      setNotes(newNotes);
      return;
    }

    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[row][col] = num;

    const newErrors = JSON.parse(JSON.stringify(errors));
    if (solution[row][col] !== num) {
      newErrors[row][col] = true;
      setLives(lives - 1);
      setTotalErrors(totalErrors + 1);
    } else {
      newErrors[row][col] = false;
      const newNotes = notes.map(row => row.map(set => new Set(set)));
      newNotes[row][col].clear();
      setNotes(newNotes);
    }

    setGrid(newGrid);
    setErrors(newErrors);
  };

  const handleDelete = () => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialGrid[row][col] !== null) return;

    saveHistory();

    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[row][col] = null;
    setGrid(newGrid);

    const newErrors = JSON.parse(JSON.stringify(errors));
    newErrors[row][col] = false;
    setErrors(newErrors);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setGrid(JSON.parse(JSON.stringify(previous.grid)));
    setNotes(previous.notes.map(row => row.map(set => new Set(set))));
    setHistory(history.slice(0, -1));
  };

  const handleHint = () => {
    if (!selectedCell) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (initialGrid[row][col] === null && grid[row][col] === null) {
            setSelectedCell([row, col]);
            return;
          }
        }
      }
      return;
    }

    const [row, col] = selectedCell;
    if (initialGrid[row][col] !== null) return;

    saveHistory();

    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[row][col] = solution[row][col];
    setGrid(newGrid);

    const newNotes = notes.map(row => row.map(set => new Set(set)));
    newNotes[row][col].clear();
    setNotes(newNotes);

    setHintsUsed(hintsUsed + 1);
  };

  const isGameComplete = (): boolean => {
    if (!grid || grid.length === 0 || !solution || solution.length === 0) {
      return false;
    }
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!grid[row] || !solution[row]) {
          return false;
        }
        if (grid[row][col] === null || grid[row][col] !== solution[row][col]) {
          return false;
        }
      }
    }
    return true;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    if (time >= 840) return 'text-red-500';
    if (time >= 720) return 'text-yellow-500';
    return 'text-white';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-sky-500 text-white p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-sky-600 rounded-lg transition">
          <ArrowLeft size={24} />
        </button>
        <div className={`text-xl font-bold ${getTimeColor()}`}>{formatTime(time)} / 15:00</div>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              size={24}
              className={i < lives ? 'fill-white' : 'fill-sky-300 opacity-30'}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <div className="inline-block bg-sky-600 p-[3px] rounded-lg">
            <div className="grid grid-cols-3 gap-[3px]">
              {[0, 1, 2].map(blockRow => (
                [0, 1, 2].map(blockCol => (
                  <div key={`block-${blockRow}-${blockCol}`} className="bg-sky-200 p-[1px]">
                    <div className="grid grid-cols-3 gap-[1px]">
                      {[0, 1, 2].map(cellRow => (
                        [0, 1, 2].map(cellCol => {
                          const rowIndex = blockRow * 3 + cellRow;
                          const colIndex = blockCol * 3 + cellCol;
                          const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
                          const isInitial = initialGrid[rowIndex]?.[colIndex] !== null;
                          const isError = errors[rowIndex]?.[colIndex];
                          const cell = grid[rowIndex]?.[colIndex];

                          return (
                            <button
                              key={`${rowIndex}-${colIndex}`}
                              onClick={() => setSelectedCell([rowIndex, colIndex])}
                              className={`
                                w-12 h-12 flex items-center justify-center text-lg relative
                                ${isSelected ? 'bg-sky-100' : 'bg-white'}
                                ${isInitial ? 'font-bold text-gray-900' : isError ? 'text-red-600 font-semibold' : 'text-sky-600'}
                                ${isError ? 'bg-red-50' : ''}
                                hover:bg-sky-50 transition
                              `}
                            >
                              {cell !== null ? (
                                cell
                              ) : notes[rowIndex]?.[colIndex]?.size > 0 ? (
                                <div className="grid grid-cols-3 grid-rows-3 gap-0 absolute inset-0 p-0.5">
                                  {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(num => (
                                    <div key={num} className="text-[10px] text-sky-400 flex items-center justify-center font-medium">
                                      {notes[rowIndex][colIndex].has(num) ? num : ''}
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </button>
                          );
                        })
                      ))}
                    </div>
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="w-12 h-12 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-bold"
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setPencilMode(!pencilMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              pencilMode ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <PencilLine size={20} />
            <span>Ghi chú</span>
          </button>
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            <Undo size={20} />
            <span>Hoàn tác</span>
          </button>
          <button
            onClick={handleHint}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            <Lightbulb size={20} />
            <span>Gợi ý</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <Eraser size={20} />
            <span>Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
