import { applyGameAction, createInitialGame } from '../src/game/engine';
import { levels } from '../src/game/levels';
import { solveLevel, validateLevel } from '../src/game/solver';
import type { LevelDefinition } from '../src/game/types';

describe('puzzle pack', () => {
  test('contains 40 distinct sequential valid 4x4 boards', () => {
    expect(levels.map((level) => level.id)).toEqual(Array.from({ length: 40 }, (_, i) => i + 1));
    const layouts = new Set<string>();
    for (const level of levels) {
      expect(level.size).toBe(4);
      expect(validateLevel(level)).toEqual([]);
      layouts.add(level.initialBoard.map((row) => row.map((cell) => cell?.direction ?? '.').join(',')).join('/'));
    }
    expect(layouts.size).toBe(levels.length);
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
    const arrowCount = level.initialBoard.flat().filter((cell) => cell !== null).length;
    const shiftCount = solution.actions.filter((action) => action.type === 'SHIFT_ROW').length;
    expect(shiftCount).toBe(solution.moves - arrowCount);
    if (level.id >= 6) {
      // A zero-shift solution would use exactly one move per arrow, so it
      // cannot exist if the shortest solution is longer than arrowCount.
      expect(solution.moves).toBeGreaterThan(arrowCount);
      expect(shiftCount).toBeGreaterThan(0);
    } else {
      expect(shiftCount).toBe(0);
    }
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
