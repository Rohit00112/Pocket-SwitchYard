import { applyGameAction, canExit, createInitialGame, findArrow, isBoardEmpty, removeArrow, shiftRow } from '../src/game/engine';
import { calculateStars } from '../src/game/scoring';
import type { Board, LevelDefinition } from '../src/game/types';

const board: Board = [
  [{ id: 'a', direction: 'RIGHT' }, { id: 'b', direction: 'UP' }, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];
const level: LevelDefinition = { id: 99, title: 'Test', size: 4, initialBoard: board, parMoves: 2, difficulty: 'easy' };

describe('pure gameplay rules', () => {
  test('finds available and blocked exit paths', () => {
    expect(findArrow(board, 'a')).toMatchObject({ row: 0, col: 0 });
    expect(findArrow(board, 'unknown')).toBeNull();
    expect(canExit(board, 0, 0)).toBe(false);
    expect(canExit(board, 0, 1)).toBe(true);
    expect(canExit(board, 2, 2)).toBe(false);
  });

  test('only a successful exit counts and creates one undo entry', () => {
    const start = createInitialGame(level);
    const blocked = applyGameAction(start, { type: 'EXIT_ARROW', arrowId: 'a' }, level);
    expect(blocked).toMatchObject({ changed: false, reason: 'blocked' });
    expect(blocked.state).toBe(start);
    const success = applyGameAction(start, { type: 'EXIT_ARROW', arrowId: 'b' }, level);
    expect(success.changed).toBe(true);
    expect(success.state.moves).toBe(1);
    expect(success.state.history).toHaveLength(1);
    expect(success.state.board[0][1]).toBeNull();
    expect(start.board[0][1]).toEqual(board[0][1]);
  });

  test('row shifts move exactly one cell and wrap without modifying IDs', () => {
    const source: Board = [
      [{ id: 'x', direction: 'LEFT' }, null, { id: 'y', direction: 'DOWN' }, null],
      ...board.slice(1),
    ];
    const left = shiftRow(source, 0, 'LEFT');
    const right = shiftRow(source, 0, 'RIGHT');
    expect(left[0].map((a) => a?.id ?? '.')).toEqual(['.', 'y', '.', 'x']);
    expect(right[0].map((a) => a?.id ?? '.')).toEqual(['.', 'x', '.', 'y']);
    expect(left[0][3]).toMatchObject({ direction: 'LEFT' });
    expect(right[0][3]).toMatchObject({ direction: 'DOWN' });
    expect(source[0][0]?.id).toBe('x');
    expect(shiftRow(source, 9, 'LEFT')).toBe(source);
  });

  test('undo returns the exact snapshot and restart clears history', () => {
    const start = createInitialGame(level);
    const shifted = applyGameAction(start, { type: 'SHIFT_ROW', row: 0, direction: 'LEFT' }, level).state;
    const escaped = applyGameAction(shifted, { type: 'EXIT_ARROW', arrowId: 'b' }, level);
    expect(escaped.changed).toBe(true);
    const undone = applyGameAction(escaped.state, { type: 'UNDO' }, level).state;
    expect(undone.board).toEqual(shifted.board);
    expect(undone.moves).toBe(shifted.moves);
    expect(undone.status).toBe('playing');
    expect(undone.history).toHaveLength(1);
    const restart = applyGameAction(undone, { type: 'RESTART' }, level).state;
    expect(restart.board).toEqual(start.board);
    expect(restart.moves).toBe(0);
    expect(restart.history).toHaveLength(0);
  });

  test('pause gates moves without adding to history', () => {
    const start = createInitialGame(level);
    const paused = applyGameAction(start, { type: 'PAUSE' }, level).state;
    expect(paused.history).toHaveLength(0);
    expect(applyGameAction(paused, { type: 'SHIFT_ROW', row: 1, direction: 'RIGHT' }, level).changed).toBe(false);
    expect(applyGameAction(paused, { type: 'RESUME' }, level).state.status).toBe('playing');
  });

  test('detects a completed level and awards stars', () => {
    const minimal: LevelDefinition = {
      ...level,
      initialBoard: [
        [{ id: 'solo', direction: 'LEFT' }, null, null, null],
        ...board.slice(1),
      ],
      parMoves: 1,
    };
    const start = createInitialGame(minimal);
    const finished = applyGameAction(start, { type: 'EXIT_ARROW', arrowId: 'solo' }, minimal).state;
    expect(finished.status).toBe('complete');
    expect(isBoardEmpty(finished.board)).toBe(true);
    expect(removeArrow(minimal.initialBoard, 0, 0)[0][0]).toBeNull();
    expect(applyGameAction(finished, { type: 'SHIFT_ROW', row: 0, direction: 'LEFT' }, minimal).changed).toBe(false);
    expect(applyGameAction(finished, { type: 'UNDO' }, minimal).state.status).toBe('playing');
    expect(calculateStars(1, 1)).toBe(3);
    expect(calculateStars(3, 1)).toBe(2);
    expect(calculateStars(4, 1)).toBe(1);
  });
});
