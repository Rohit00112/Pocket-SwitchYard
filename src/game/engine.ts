import type { Board, GameState, LevelDefinition } from './types';

/** Construct an immutable initial state; engine transitions arrive in Phase 2. */
export function createInitialGame(level: LevelDefinition): GameState {
  return {
    levelId: level.id,
    board: level.initialBoard.map((row) => row.map((arrow) => (arrow ? { ...arrow } : null))),
    moves: 0,
    status: 'playing',
    history: [],
  };
}

export function isBoardEmpty(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell === null));
}
