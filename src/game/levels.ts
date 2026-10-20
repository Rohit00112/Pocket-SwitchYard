import type { Arrow, Board, Direction, LevelDefinition } from './types';

// A dot is empty; U/D/L/R represent the arrow facing that direction.
function board(rows: readonly string[]): Board {
  return rows.map((row, r) => [...row].map((token, c): Arrow | null => {
    const directions: Record<string, Direction> = { U: 'UP', D: 'DOWN', L: 'LEFT', R: 'RIGHT' };
    return token === '.' ? null : { id: `r${r}c${c}`, direction: directions[token] };
  }));
}

/** Authored puzzles. Shortest path and par are checked in tests by BFS. */
export const levels: readonly LevelDefinition[] = [
  { id: 1, title: 'First departure', size: 4, initialBoard: board(['..U.', '.R..', '..L.', '...D']), parMoves: 4, difficulty: 'easy', tutorial: 'Tap a cart when the space in front of it is empty all the way to the edge.' },
  { id: 2, title: 'Make some room', size: 4, initialBoard: board(['.U..', 'RR..', '.D..', '.L..']), parMoves: 5, difficulty: 'easy', tutorial: 'A cart blocks another cart. Clear the front cart first.' },
  { id: 3, title: 'One at a time', size: 4, initialBoard: board(['.D..', 'RR..', '..U.', '..L.']), parMoves: 5, difficulty: 'easy', tutorial: 'Follow the chain: one delivery cart might be holding up several others.' },
  { id: 4, title: 'Around the bend', size: 4, initialBoard: board(['.D.L', 'RR..', '.LL.', 'R...']), parMoves: 7, difficulty: 'medium', tutorial: 'Look for a free cart first. Clearing one route can open many more.' },
  { id: 5, title: 'The little junction', size: 4, initialBoard: board(['.DLL', 'RR..', '.LL.', 'R..D']), parMoves: 9, difficulty: 'medium', tutorial: 'Plan your escape order carefully. Remember, you can always undo your last move.' },
  { id: 6, title: 'First row shift', size: 4, initialBoard: board(['...U', 'RL..', '.D..', 'L...']), parMoves: 6, difficulty: 'easy', tutorial: 'Shift a row to separate two carts facing each other, then release them.' },
  { id: 7, title: 'Twice around', size: 4, initialBoard: board(['.RL.', '..U.', '...D', 'L...']), parMoves: 7, difficulty: 'medium', tutorial: 'A row can need two shifts. Watch for a vertical exit that opens between them.' },
  { id: 8, title: 'Crossing lanes', size: 4, initialBoard: board(['R..L', '..D.', '.U..', '.RL.']), parMoves: 9, difficulty: 'medium', tutorial: 'Shift different rows to clear the downward route and free both trapped pairs.' },
  { id: 9, title: 'Packed platform', size: 4, initialBoard: board(['RRLL', 'U..D', '..D.', '.R..']), parMoves: 10, difficulty: 'hard', tutorial: 'On a crowded row, clear the free carts first and shift to open both ends.' },
  { id: 10, title: 'The final switchyard', size: 4, initialBoard: board(['.RL.', 'D..U', 'RRLL', '...L']), parMoves: 13, difficulty: 'hard', tutorial: 'Clear outer lanes, shift the crowded rows, and use the openings to finish.' },
];

export function getLevel(id: number): LevelDefinition | undefined {
  return levels.find((level) => level.id === id);
}
