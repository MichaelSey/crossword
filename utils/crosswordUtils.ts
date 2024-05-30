// utils/crosswordUtils.ts

export type Grid = string[][];

export interface Clues {
  across: { [key: number]: string };
  down: { [key: number]: string };
}

export interface CrosswordData {
  grid: Grid;
  clues: Clues;
  positions: { [key: string]: { row: number; col: number; direction: 'across' | 'down' } };
}

export const createEmptyGrid = (size: number): Grid => {
  return Array(size).fill(null).map(() => Array(size).fill(''));
};

const wordList: string[] = ['HELLO', 'WORLD', 'REACT', 'JAVASCRIPT', 'CROSSWORD', 'PUZZLE', 'GRID', 'RANDOM', 'COMPONENT'];

export const getRandomWords = (numWords: number): string[] => {
  const shuffled = wordList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numWords);
};

const directions: ('horizontal' | 'vertical')[] = ['horizontal', 'vertical'];

export const placeWordsInGrid = (grid: Grid, words: string[]): CrosswordData => {
  const size = grid.length;
  const clues: Clues = { across: {}, down: {} };
  const positions: { [key: string]: { row: number; col: number; direction: 'across' | 'down' } } = {};
  let clueNumber = 1;

  words.forEach(word => {
    let placed = false;

    while (!placed) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (direction === 'horizontal' && col + word.length <= size) {
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
          }
          clues.across[clueNumber] = word;
          positions[clueNumber] = { row, col, direction: 'across' };
          clueNumber++;
          placed = true;
        }
      } else if (direction === 'vertical' && row + word.length <= size) {
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[row + i][col] = word[i];
          }
          clues.down[clueNumber] = word;
          positions[clueNumber] = { row, col, direction: 'down' };
          clueNumber++;
          placed = true;
        }
      }
    }
  });

  return { grid, clues, positions };
};
