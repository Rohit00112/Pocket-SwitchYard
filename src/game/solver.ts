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

export type SearchResult =
  | { status: 'solved'; solution: SolvedLevel }
  | { status: 'working' }
  | { status: 'exhausted' };

/**
 * A bounded, resumable breadth-first search. Both authoring validation and
 * interactive hints use the same transition rules and exact action replay.
 */
export function createBoardSearch(start: Board, maxStates = 80000, maxDepth = 28) {
  const visited = new Set<string>([boardKey(start)]);
  const nodes: QueueNode[] = [{ board: start, parent: -1, action: null, depth: 0 }];
  let head = 0;
  let exhausted = false;

  function step(nodeBudget: number): SearchResult {
    if (exhausted) return { status: 'exhausted' };
    for (let processed = 0; processed < nodeBudget && head < nodes.length; processed++) {
      const node = nodes[head];
      if (isBoardEmpty(node.board)) {
        const actions: GameAction[] = [];
        let at = head;
        while (nodes[at].parent !== -1) {
          actions.push(nodes[at].action!);
          at = nodes[at].parent;
        }
        actions.reverse();
        return { status: 'solved', solution: { moves: actions.length, actions, visited: visited.size } };
      }
      const currentIndex = head++;
      if (node.depth >= maxDepth) continue;
      for (let r = 0; r < node.board.length; r++) {
        for (let c = 0; c < node.board[r].length; c++) {
          const arrow = node.board[r][c];
          if (arrow && canExit(node.board, r, c)) {
            const next = removeArrow(node.board, r, c);
            const key = boardKey(next);
            if (!visited.has(key)) {
              if (visited.size >= maxStates) { exhausted = true; return { status: 'exhausted' }; }
              visited.add(key);
              nodes.push({ board: next, parent: currentIndex, action: { type: 'EXIT_ARROW', arrowId: arrow.id }, depth: node.depth + 1 });
            }
          }
        }
        for (const direction of ['LEFT', 'RIGHT'] as const) {
          const next = shiftRow(node.board, r, direction);
          const key = boardKey(next);
          if (visited.has(key)) continue;
          if (visited.size >= maxStates) { exhausted = true; return { status: 'exhausted' }; }
          visited.add(key);
          nodes.push({ board: next, parent: currentIndex, action: { type: 'SHIFT_ROW', row: r, direction }, depth: node.depth + 1 });
        }
      }
    }
    if (head < nodes.length) return { status: 'working' };
    exhausted = true;
    return { status: 'exhausted' };
  }
  return { step };
}

/** Split hint searches over multiple JS tasks to keep taps and drawing responsive. */
export async function findHint(
  board: Board,
  options: { maxStates?: number; maxDepth?: number; batchSize?: number; signal?: AbortSignal } = {},
): Promise<GameAction | null> {
  const search = createBoardSearch(board, options.maxStates ?? 80000, options.maxDepth ?? 28);
  for (;;) {
    if (options.signal?.aborted) return null;
    const result = search.step(options.batchSize ?? 200);
    if (result.status === 'solved') return result.solution.actions[0] ?? null;
    if (result.status === 'exhausted') return null;
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
}

/**
 * Bounded BFS finds the shortest winning path for small authored boards.
 * Run during authoring/tests, never from animation frames or user taps.
 */
export function solveLevel(level: LevelDefinition, maxStates = 80000, maxDepth = 28): SolvedLevel | null {
  if (validateLevel(level).length > 0) return null;
  const search = createBoardSearch(level.initialBoard, maxStates, maxDepth);
  for (;;) {
    const result = search.step(4000);
    if (result.status === 'solved') return result.solution;
    if (result.status === 'exhausted') return null;
  }
}
