import { applyGameAction, createInitialGame } from '../src/game/engine';
import { levels } from '../src/game/levels';
import { solveLevel, validateLevel } from '../src/game/solver';
import type { LevelDefinition } from '../src/game/types';

describe('starter puzzle pack', () => {
  test('contains five sequential valid 4x4 boards', () => {
    expect(levels.map((level) => level.id)).toEqual([1, 2, 3, 4, 5]);
    for (const level of levels) expect(validateLevel(level)).toEqual([]);
  });

  test.each(levels)('level $id has a verified shortest solution that can be replayed', (level) => {
    const solution = solveLevel(level);
    expect(solution).not.toBeNull();
    if (!solution) return;
    expect(solution.moves).toBe(level.parMoves);
    let state = createInitialGame(level);
    for (const action of solution.actions) {
      const transition = applyGameAction(state, action, level);
      expect(transition.changed).toBe(true);
      state = transition.state;
    }
    expect(state.status).toBe('complete');
    expect(state.moves).toBe(solution.moves);
    expect(state.history).toHaveLength(solution.moves);
    expect(solution.actions.some((action) => action.type === 'SHIFT_ROW')).toBe(false);
  });

  test('rejects incorrectly sized boards, duplicate IDs and invalid directions', () => {
    const first = levels[0];
    const invalid: LevelDefinition = {
      ...first,
      initialBoard: [
        [{ id: 'same', direction: 'UP' }, { id: 'same', direction: 'SIDEWAYS' as never }, null],
        ...first.initialBoard.slice(1),
      ],
    };
    const errors = validateLevel(invalid);
    expect(errors).toEqual(expect.arrayContaining([
      'Board dimensions do not match level size', 'Duplicate arrow ID: same', 'Invalid arrow direction',
    ]));
    expect(solveLevel(invalid)).toBeNull();
  });
});
