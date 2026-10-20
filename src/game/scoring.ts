export function calculateStars(moves: number, parMoves: number): 1 | 2 | 3 {
  if (moves <= parMoves) return 3;
  if (moves <= parMoves + 2) return 2;
  return 1;
}
