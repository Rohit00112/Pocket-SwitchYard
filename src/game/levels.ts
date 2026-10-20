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
  { id: 11, title: 'Down the line', size: 4, initialBoard: board(['L...', '.U..', 'RL..', '...D']), parMoves: 6, difficulty: 'medium', tutorial: 'Use one careful shift to separate carts facing opposite directions.' },
  { id: 12, title: 'Western turn', size: 4, initialBoard: board(['U...', '..RL', '..D.', '...R']), parMoves: 6, difficulty: 'medium', tutorial: 'The exit might appear on the far side of a row after a shift.' },
  { id: 13, title: 'Return journey', size: 4, initialBoard: board(['...R', '..U.', '..RL', 'D...']), parMoves: 6, difficulty: 'medium', tutorial: 'Look at the board edge before deciding which row to shift.' },
  { id: 14, title: 'Platform shuffle', size: 4, initialBoard: board(['L...', '...U', '..D.', '.RL.']), parMoves: 7, difficulty: 'medium', tutorial: 'Two shifts can be useful even when you see an easy escape.' },
  { id: 15, title: 'Blue line', size: 4, initialBoard: board(['.RL.', '.U..', 'D...', '...R']), parMoves: 7, difficulty: 'medium', tutorial: 'Watch the upward cart as you move the horizontal pair.' },
  { id: 16, title: 'Return to center', size: 4, initialBoard: board(['...R', 'U...', '.D..', '.RL.']), parMoves: 7, difficulty: 'medium', tutorial: 'Remember that carts keep their direction as the row wraps.' },
  { id: 17, title: 'Double parked', size: 4, initialBoard: board(['...U', 'RL..', '.D..', 'LU..']), parMoves: 8, difficulty: 'medium', tutorial: 'A second upward cart changes the best escape order.' },
  { id: 18, title: 'First stop east', size: 4, initialBoard: board(['RRL.', '..U.', '...D', 'L...']), parMoves: 8, difficulty: 'medium', tutorial: 'Free the front cart before clearing the pair behind it.' },
  { id: 19, title: 'Wrapped corner', size: 4, initialBoard: board(['.RL.', '..U.', '...D', 'L..R']), parMoves: 8, difficulty: 'medium', tutorial: 'The right edge is closer than it looks after a row wraps.' },
  { id: 20, title: 'Traffic crossing', size: 4, initialBoard: board(['.RL.', '..U.', '.R.D', 'L...']), parMoves: 8, difficulty: 'medium', tutorial: 'Clear a crossing lane so that the other arrows can escape.' },
  { id: 21, title: 'Reversed lanes', size: 4, initialBoard: board(['.RL.', '.D..', '..U.', 'R..L']), parMoves: 9, difficulty: 'medium', tutorial: 'Untangle both horizontal pairs using a sequence of shifts.' },
  { id: 22, title: 'The eastern crossing', size: 4, initialBoard: board(['R..L', '.D..', '..U.', '.RL.']), parMoves: 9, difficulty: 'medium', tutorial: 'Moving a pair may also open a vertical passage.' },
  { id: 23, title: 'Northbound route', size: 4, initialBoard: board(['.RL.', '..D.', '.U..', 'R..L']), parMoves: 9, difficulty: 'medium', tutorial: 'Consider which vertical cart will be freed by the next shift.' },
  { id: 24, title: 'Extra delivery', size: 4, initialBoard: board(['R..L', '..D.', '.U..', '.RLR']), parMoves: 10, difficulty: 'medium', tutorial: 'One more cart means your shift order matters even more.' },
  { id: 25, title: 'Twin engines', size: 4, initialBoard: board(['R.RL', '..D.', '.U..', '.RL.']), parMoves: 10, difficulty: 'medium', tutorial: 'Keep an eye on the right-facing carts near the top.' },
  { id: 26, title: 'Corner delivery', size: 4, initialBoard: board(['R..L', '..DR', '.U..', '.RL.']), parMoves: 10, difficulty: 'medium', tutorial: 'Free space beside the right edge can help later on.' },
  { id: 27, title: 'Packed southbound', size: 4, initialBoard: board(['.R..', '..U.', 'D..U', 'RRLL']), parMoves: 10, difficulty: 'hard', tutorial: 'A crowded bottom row will need careful repositioning.' },
  { id: 28, title: 'Crowded rooftops', size: 4, initialBoard: board(['RRLL', 'D..U', '.D..', '..L.']), parMoves: 10, difficulty: 'hard', tutorial: 'Start with an open path, then shift the most crowded row.' },
  { id: 29, title: 'Opposite station', size: 4, initialBoard: board(['..L.', '.U..', 'U..D', 'RRLL']), parMoves: 10, difficulty: 'hard', tutorial: 'Look for a route that clears both rows of congestion.' },
  { id: 30, title: 'Extra right turn', size: 4, initialBoard: board(['RRLL', 'U..D', '..D.', '.R.R']), parMoves: 11, difficulty: 'hard', tutorial: 'An extra delivery on the bottom row adds another escape step.' },
  { id: 31, title: 'Left platform', size: 4, initialBoard: board(['RRLL', 'U..D', '.RD.', '.R..']), parMoves: 11, difficulty: 'hard', tutorial: 'Find a useful shift before moving the center-right cart.' },
  { id: 32, title: 'Tight south lane', size: 4, initialBoard: board(['RRLL', 'U..D', '..D.', 'RR..']), parMoves: 11, difficulty: 'hard', tutorial: 'Two right-facing carts compete for one opening.' },
  { id: 33, title: 'Middle crossing', size: 4, initialBoard: board(['RRLL', 'UL.D', '..D.', '.R..']), parMoves: 11, difficulty: 'hard', tutorial: 'Use the middle-left cart to help break up the blockage.' },
  { id: 34, title: 'Westbound freight', size: 4, initialBoard: board(['RRLL', 'U..D', 'L.D.', '.R..']), parMoves: 11, difficulty: 'hard', tutorial: 'Even carts near the edge may need the right row arrangement.' },
  { id: 35, title: 'Platform lock', size: 4, initialBoard: board(['RRLL', 'U..D', '..D.', '.RL.']), parMoves: 13, difficulty: 'hard', tutorial: 'A trapped bottom pair needs several moves to separate.' },
  { id: 36, title: 'Last delivery west', size: 4, initialBoard: board(['RRLL', 'U..D', '..D.', '.R.L']), parMoves: 12, difficulty: 'hard', tutorial: 'Keep one side of the board free while handling the full row.' },
  { id: 37, title: 'Southern loops', size: 4, initialBoard: board(['...L', 'RRLL', 'U..D', '.RL.']), parMoves: 13, difficulty: 'hard', tutorial: 'Think several moves ahead when two rows start tightly packed.' },
  { id: 38, title: 'Through the middle', size: 4, initialBoard: board(['.RL.', 'U..D', 'RRLL', 'R...']), parMoves: 13, difficulty: 'hard', tutorial: 'Work outward from the crowded central lanes.' },
  { id: 39, title: 'Western loop', size: 4, initialBoard: board(['R...', 'RRLL', 'D..U', '.RL.']), parMoves: 13, difficulty: 'hard', tutorial: 'Shift crowded rows only when you have a purpose for each move.' },
  { id: 40, title: 'Master dispatcher', size: 4, initialBoard: board(['.RL.', 'D..U', 'RRLL', '.L.L']), parMoves: 14, difficulty: 'hard', tutorial: 'Use everything you have learned to untangle this last station.' },
];

export function getLevel(id: number): LevelDefinition | undefined {
  return levels.find((level) => level.id === id);
}
