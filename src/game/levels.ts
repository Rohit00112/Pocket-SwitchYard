import type { Arrow, Board, Direction, LevelDefinition } from './types';

function cart(id: string, direction: Direction): Arrow {
  return { id, direction };
}

/** Phase 1 artwork and board preview. Solvability checks arrive with the Phase 2 rules. */
const firstBoard: Board = [
  [cart('a', 'RIGHT'), null, cart('b', 'UP'), null],
  [cart('c', 'UP'), cart('d', 'DOWN'), null, cart('e', 'LEFT')],
  [cart('f', 'RIGHT'), null, cart('g', 'LEFT'), cart('h', 'UP')],
  [null, cart('i', 'RIGHT'), cart('j', 'DOWN'), null],
];

export const levels: readonly LevelDefinition[] = [
  {
    id: 1,
    title: 'First departure',
    size: 4,
    initialBoard: firstBoard,
    parMoves: 12,
    difficulty: 'easy',
    tutorial: 'Clear a path to the edge to send each cart on its way.',
  },
];

export function getLevel(id: number): LevelDefinition | undefined {
  return levels.find((level) => level.id === id);
}
