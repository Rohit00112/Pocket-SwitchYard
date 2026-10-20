export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Arrow {
  readonly id: string;
  readonly direction: Direction;
}

export type Cell = Arrow | null;
export type Board = readonly (readonly Cell[])[];

export interface LevelDefinition {
  readonly id: number;
  readonly title: string;
  readonly size: 4 | 5;
  readonly initialBoard: Board;
  readonly parMoves: number;
  readonly difficulty: Difficulty;
  readonly tutorial?: string;
}

export type GameStatus = 'playing' | 'paused' | 'complete';

export interface GameSnapshot {
  readonly board: Board;
  readonly moves: number;
  readonly status: GameStatus;
}

export interface GameState extends GameSnapshot {
  readonly levelId: number;
  readonly history: readonly GameSnapshot[];
}

export type GameAction =
  | { readonly type: 'EXIT_ARROW'; readonly arrowId: string }
  | { readonly type: 'SHIFT_ROW'; readonly row: number; readonly direction: 'LEFT' | 'RIGHT' }
  | { readonly type: 'UNDO' }
  | { readonly type: 'RESTART' }
  | { readonly type: 'PAUSE' }
  | { readonly type: 'RESUME' };

export interface MoveResult {
  readonly state: GameState;
  readonly changed: boolean;
  readonly reason?: 'blocked' | 'busy' | 'invalid';
}
