import { canExit, isBoardEmpty, removeArrow, shiftRow } from './engine';
import type { Board, GameAction, LevelDefinition } from './types';

export function validateLevel(level: LevelDefinition): string[] {
  const issues: string[] = [];
  if (!Number.isInteger(level.id) || level.id < 1) issues.push('Invalid level ID');
  if (level.size !== 4 && level.size !== 5) issues.push('Board size must be 4 or 5');
  if (level.initialBoard.length !== level.size || level.initialBoard.some((row) => !Array.isArray(row) || row.length !== level.size)) {
    issues.push('Board dimensions do not match level size');
  }
  if (!Number.isInteger(level.parMoves) || level.parMoves < 1) issues.push('Invalid par moves');
  if (!['easy', 'medium', 'hard'].includes(level.difficulty)) issues.push('Invalid difficulty');

  const ids = new Set<string>();
  for (const row of level.initialBoard) {
    if (!Array.isArray(row)) continue;
    for (const cell of row) {
      if (cell === null) continue;
      if (typeof cell !== 'object' || typeof cell.id !== 'string' || !cell.id.length) {
        issues.push('Malformed arrow ID');
        continue;
      }
      if (ids.has(cell.id)) issues.push('Duplicate arrow ID: ' + cell.id);
      ids.add(cell.id);
      if (!['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(cell.direction)) issues.push('Invalid arrow direction');
    }
  }
  if (ids.size === 0) issues.push('Empty level');
  return issues;
}

/** IDs aren't needed for the search key: identical directions are mechanically interchangeable. */
function boardKey(board: Board): string {
  return board.map((row) => row.map((arrow) => arrow?.direction[0] ?? '.').join('')).join('/');
}

interface QueueNode { board: Board; parent: number; action: GameAction | null; depth: number; }
export interface SolvedLevel { moves: number; actions: GameAction[]; visited: number; }

/**
 * Bounded BFS finds the shortest winning path for small authored boards.
 * Run during authoring/tests, never from animation frames or user taps.
 */
export function solveLevel(level: LevelDefinition, maxStates = 80000, maxDepth = 28): SolvedLevel | null {
  if (validateLevel(level).length > 0) return null;
  const visited = new Set<string>();
  const nodes: QueueNode[] = [{ board: level.initialBoard, parent: -1, action: null, depth: 0 }];
  visited.add(boardKey(level.initialBoard));
  for (let head = 0; head < nodes.length; head++) {
    const node = nodes[head];
    if (isBoardEmpty(node.board)) {
      const actions: GameAction[] = [];
      let at = head;
      while (nodes[at].parent !== -1) {
        actions.push(nodes[at].action!);
        at = nodes[at].parent;
      }
      actions.reverse();
      return { moves: actions.length, actions, visited: visited.size };
    }
    if (node.depth >= maxDepth) continue;
    const next: { board: Board; action: GameAction }[] = [];
    for (let r = 0; r < node.board.length; r++) {
      for (let c = 0; c < node.board.length; c++) {
        const arrow = node.board[r][c];
        if (arrow && canExit(node.board, r, c)) next.push({ board: removeArrow(node.board, r, c), action: { type: 'EXIT_ARROW', arrowId: arrow.id } });
      }
      // Rotating a row with zero or one distinct cell cannot change the puzzle.
      for (const direction of ['LEFT', 'RIGHT'] as const) {
        next.push({ board: shiftRow(node.board, r, direction), action: { type: 'SHIFT_ROW', row: r, direction } });
      }
    }
    for (const option of next) {
      const key = boardKey(option.board);
      if (visited.has(key)) continue;
      if (visited.size >= maxStates) return null;
      visited.add(key);
      nodes.push({ ...option, parent: head, depth: node.depth + 1 });
    }
  }
  return null;
}
