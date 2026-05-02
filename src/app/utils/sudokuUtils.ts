export function isValid(grid: number[][], row: number, col: number, num: number): boolean {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (grid[boxRow + i][boxCol + j] === num) return false;
  return true;
}

export function fillGrid(grid: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const numbers = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
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
}

export function generateSudoku(): number[][] {
  const grid = Array(9).fill(null).map(() => Array(9).fill(0));
  fillGrid(grid);
  return grid;
}

export function createPuzzle(solution: number[][], difficulty: string): (number | null)[][] {
  const puzzle: (number | null)[][] = JSON.parse(JSON.stringify(solution));
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
}

export function isGameComplete(
  grid: (number | null)[][],
  solution: number[][]
): boolean {
  if (!grid?.length || !solution?.length) return false;
  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 9; col++)
      if (!grid[row] || grid[row][col] === null || grid[row][col] !== solution[row][col])
        return false;
  return true;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getStars(time: number, hintsUsed: number, errors: number): number {
  if (time <= 480 && hintsUsed <= 1 && errors <= 1) return 3;
  if (time <= 720 && hintsUsed <= 2 && errors <= 3) return 2;
  return 1;
}