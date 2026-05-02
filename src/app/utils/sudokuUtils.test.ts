import { describe, it, expect } from 'vitest';
import {
  generateSudoku,
  createPuzzle,
  isValid,
  isGameComplete,
  formatTime,
  getStars,
} from './sudokuUtils';

// TC73
describe('TC73 - generateSudoku luon tra ve grid hop le', () => {
  it('chay 100 lan, moi grid deu khong trung hang/cot/block', () => {
    for (let run = 0; run < 100; run++) {
      const grid = generateSudoku();
      expect(grid.length).toBe(9);
      grid.forEach(row => expect(row.length).toBe(9));
      grid.forEach(row => expect(new Set(row).size).toBe(9));
      for (let col = 0; col < 9; col++) {
        const column = grid.map(row => row[col]);
        expect(new Set(column).size).toBe(9);
      }
      for (let br = 0; br < 3; br++) {
        for (let bc = 0; bc < 3; bc++) {
          const block: number[] = [];
          for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
              block.push(grid[br * 3 + i][bc * 3 + j]);
          expect(new Set(block).size).toBe(9);
        }
      }
    }
  });
});

// TC08-TC10
describe('TC08/09/10 - createPuzzle so o trong theo do kho', () => {
  const solution = generateSudoku();

  it('TC08 - Easy: 40 o trong', () => {
    const puzzle = createPuzzle(solution, 'easy');
    const nullCount = puzzle.flat().filter(c => c === null).length;
    expect(nullCount).toBe(40);
  });

  it('TC09 - Medium: 50 o trong', () => {
    const puzzle = createPuzzle(solution, 'medium');
    const nullCount = puzzle.flat().filter(c => c === null).length;
    expect(nullCount).toBe(50);
  });

  it('TC10 - Hard: 60 o trong', () => {
    const puzzle = createPuzzle(solution, 'hard');
    const nullCount = puzzle.flat().filter(c => c === null).length;
    expect(nullCount).toBe(60);
  });
});

// TC07
describe('TC07 - Puzzle khong co mau thuan ban dau', () => {
  it('cac o co san trong puzzle khong vi pham luat Sudoku', () => {
    const solution = generateSudoku();
    const puzzle = createPuzzle(solution, 'easy');
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const val = puzzle[row][col];
        if (val !== null) {
          puzzle[row][col] = null;
          const gridForCheck = puzzle.map(r => r.map(c => (c === null ? 0 : c)));
          expect(isValid(gridForCheck, row, col, val)).toBe(true);
          puzzle[row][col] = val;
        }
      }
    }
  });
});

// TC74
describe('TC74 - isValid trung hang', () => {
  it('tra ve false khi so da co trong hang', () => {
    const grid = Array(9).fill(null).map(() => Array(9).fill(0));
    grid[0][0] = 5;
    expect(isValid(grid, 0, 3, 5)).toBe(false);
  });
  it('tra ve true khi so chua co trong hang', () => {
    const grid = Array(9).fill(null).map(() => Array(9).fill(0));
    grid[0][0] = 5;
    expect(isValid(grid, 0, 3, 7)).toBe(true);
  });
});

// TC75
describe('TC75 - isValid trung cot', () => {
  it('tra ve false khi so da co trong cot', () => {
    const grid = Array(9).fill(null).map(() => Array(9).fill(0));
    grid[0][2] = 3;
    expect(isValid(grid, 5, 2, 3)).toBe(false);
  });
});

// TC76
describe('TC76 - isValid trung block 3x3', () => {
  it('tra ve false khi so da co trong block', () => {
    const grid = Array(9).fill(null).map(() => Array(9).fill(0));
    grid[0][0] = 9;
    expect(isValid(grid, 1, 1, 9)).toBe(false);
  });
});

// TC77
describe('TC77 - isGameComplete khi grid = solution', () => {
  it('tra ve true', () => {
    const solution = generateSudoku();
    const grid: (number | null)[][] = solution.map(row => [...row]);
    expect(isGameComplete(grid, solution)).toBe(true);
  });
});

// TC78
describe('TC78 - isGameComplete khi con o null', () => {
  it('tra ve false khi con 1 o null', () => {
    const solution = generateSudoku();
    const grid: (number | null)[][] = solution.map(row => [...row]);
    grid[4][4] = null;
    expect(isGameComplete(grid, solution)).toBe(false);
  });
  it('tra ve false khi 1 o sai gia tri', () => {
    const solution = generateSudoku();
    const grid: (number | null)[][] = solution.map(row => [...row]);
    const wrongNum = solution[0][0] === 9 ? 1 : solution[0][0] + 1;
    grid[0][0] = wrongNum;
    expect(isGameComplete(grid, solution)).toBe(false);
  });
});

// TC51-TC52
describe('TC51/52 - Win condition', () => {
  it('TC51 - false khi con 1 o trong du 80 o dung', () => {
    const solution = generateSudoku();
    const grid: (number | null)[][] = solution.map(row => [...row]);
    grid[8][8] = null;
    expect(isGameComplete(grid, solution)).toBe(false);
  });
  it('TC52 - false khi 1 o dien sai cac o con lai dung', () => {
    const solution = generateSudoku();
    const grid: (number | null)[][] = solution.map(row => [...row]);
    grid[0][0] = solution[0][0] === 9 ? 1 : solution[0][0] + 1;
    expect(isGameComplete(grid, solution)).toBe(false);
  });
});

// TC79
describe('TC79 - formatTime', () => {
  it('formatTime(0) = "0:00"', () => expect(formatTime(0)).toBe('0:00'));
  it('formatTime(65) = "1:05"', () => expect(formatTime(65)).toBe('1:05'));
  it('formatTime(600) = "10:00"', () => expect(formatTime(600)).toBe('10:00'));
  it('formatTime(899) = "14:59"', () => expect(formatTime(899)).toBe('14:59'));
});

// TC80
describe('TC80 - getStars', () => {
  it('3 sao: time=300, hints=0, errors=0', () => expect(getStars(300, 0, 0)).toBe(3));
  it('2 sao: time=600, hints=2, errors=3', () => expect(getStars(600, 2, 3)).toBe(2));
  it('1 sao: time=800, hints=3, errors=5', () => expect(getStars(800, 3, 5)).toBe(1));
  it('1 sao: hints>2 du time ngan', () => expect(getStars(300, 3, 0)).toBe(1));
});