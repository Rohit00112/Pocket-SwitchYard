import type { Arrow, Board, GameAction, GameSnapshot, GameState, LevelDefinition, MoveResult } from './types';

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((arrow) => (arrow ? { ...arrow } : null)));
}

export function createInitialGame(level: LevelDefinition): GameState {
  return { levelId: level.id, board: cloneBoard(level.initialBoard), moves: 0, status: 'playing', history: [] };
}

export function isBoardEmpty(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell === null));
}

export function findArrow(board: Board, arrowId: string): { row: number; col: number; arrow: Arrow } | null {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const arrow = board[row][col];
      if (arrow?.id === arrowId) return { row, col, arrow };
    }
  }
  return null;
}

export function canExit(board: Board, row: number, col: number): boolean {
  const arrow = board[row]?.[col];
  if (!arrow) return false;
  let dr = 0;
  let dc = 0;
  switch (arrow.direction) {
    case 'UP': dr = -1; break;
    case 'DOWN': dr = 1; break;
    case 'LEFT': dc = -1; break;
    case 'RIGHT': dc = 1; break;
  }
  for (let r = row + dr, c = col + dc; r >= 0 && r < board.length && c >= 0 && c < board.length; r += dr, c += dc) {
    if (board[r][c] !== null) return false;
  }
  return true;
}

/** Every transformation returns fresh row arrays and preserves arrow IDs. */
export function removeArrow(board: Board, row: number, col: number): Board {
  return board.map((cells, index) => index === row ? cells.map((cell, i) => i === col ? null : cell) : [...cells]);
}

export function shiftRow(board: Board, row: number, direction: 'LEFT' | 'RIGHT'): Board {
  if (!Number.isInteger(row) || row < 0 || row >= board.length) return board;
  const count = board[row].length;
  return board.map((cells, index) => {
    if (index !== row) return [...cells];
    return cells.map((_, col) => cells[(col + (direction === 'LEFT' ? 1 : count - 1)) % count]);
  });
}

/** Invalid and blocked actions are no-ops, so they never cost a move or consume an undo slot. */
export function applyGameAction(state: GameState, action: GameAction, level: LevelDefinition): MoveResult {
  if (action.type === 'RESTART') return { state: createInitialGame(level), changed: true };
  if (action.type === 'UNDO') {
    const previous = state.history[state.history.length - 1];
    return previous ? { state: { ...state, ...previous, history: state.history.slice(0, -1) }, changed: true } : { state, changed: false, reason: 'invalid' };
  }
  if (action.type === 'PAUSE' || action.type === 'RESUME') {
    const next = action.type === 'PAUSE' ? 'paused' : 'playing';
    return state.status !== 'complete' && state.status !== next
      ? { state: { ...state, status: next }, changed: true }
      : { state, changed: false, reason: 'invalid' };
  }
  if (state.status !== 'playing') return { state, changed: false, reason: 'busy' };

  let nextBoard: Board;
  if (action.type === 'EXIT_ARROW') {
    const location = findArrow(state.board, action.arrowId);
    if (!location) return { state, changed: false, reason: 'invalid' };
    if (!canExit(state.board, location.row, location.col)) return { state, changed: false, reason: 'blocked' };
    nextBoard = removeArrow(state.board, location.row, location.col);
  } else {
    if (!Number.isInteger(action.row) || action.row < 0 || action.row >= state.board.length) {
      return { state, changed: false, reason: 'invalid' };
    }
    nextBoard = shiftRow(state.board, action.row, action.direction);
  }

  const previous: GameSnapshot = { board: state.board, moves: state.moves, status: state.status };
  return {
    changed: true,
    state: {
      ...state,
      board: nextBoard,
      moves: state.moves + 1,
      status: isBoardEmpty(nextBoard) ? 'complete' : 'playing',
      history: [...state.history, previous],
    },
  };
}
