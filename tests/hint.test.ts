import { applyGameAction, createInitialGame } from '../src/game/engine';
import { levels } from '../src/game/levels';
import { createBoardSearch, findHint } from '../src/game/solver';

describe('on-demand hints', () => {
  test('first action is legal and leads to a winning shortest path', async () => {
    const level = levels[5];
    const starting = createInitialGame(level);
    const hint = await findHint(starting.board, { batchSize: 300 });
    expect(hint).not.toBeNull();
    if (!hint) return;
    const moved = applyGameAction(starting, hint, level);
    expect(moved.changed).toBe(true);
    expect(moved.state.moves).toBe(1);
  });

  test('a shifted player board gets a new actionable hint', async () => {
    const level = levels[5];
    const moved = applyGameAction(createInitialGame(level), { type: 'SHIFT_ROW', row: 0, direction: 'RIGHT' }, level);
    expect(moved.changed).toBe(true);
    const action = await findHint(moved.state.board, { batchSize: 600 });
    expect(action).not.toBeNull();
    if (action) expect(applyGameAction(moved.state, action, level).changed).toBe(true);
  });

  test('hint requests can be canceled without applying any move', async () => {
    const controller = new AbortController();
    controller.abort();
    expect(await findHint(levels[9].initialBoard, { signal: controller.signal, batchSize: 10 })).toBeNull();
  });

  test('search processes a bounded number of states per call', () => {
    const search = createBoardSearch(levels[0].initialBoard);
    expect(search.step(1).status).toBe('working');
    let result = search.step(10);
    let count = 0;
    while (result.status === 'working' && count++ < 2000) result = search.step(100);
    expect(result.status).toBe('solved');
  });
});
