/**
 * Deterministic, offline puzzle discovery and verification.
 *
 * `node scripts/level-authoring.mjs discover 100` prints candidate layouts
 * with the exact BFS solution length, shifts and visited states.
 * `node scripts/level-authoring.mjs verify` rechecks the static level pack.
 * Candidate discovery never modifies the published level definitions.
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const source = readFileSync(filename, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  module._compile(transpiled.outputText, filename);
};

const { solveLevel, validateLevel } = require('../src/game/solver.ts');
const directions = { U: 'UP', D: 'DOWN', L: 'LEFT', R: 'RIGHT' };

function makeLevel(rows, id = 50) {
  return {
    id, title: 'Authoring candidate', size: 4, difficulty: 'hard', parMoves: 1,
    initialBoard: rows.map((row, r) => [...row].map((token, c) => token === '.'
      ? null : { id: `r${r}c${c}`, direction: directions[token] })),
  };
}

function rng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 0x100000000;
  };
}

function sampleBoard(random, arrowCount) {
  const cells = Array(16).fill('.');
  // Opposing carts deliberately create a blockage requiring row manipulation.
  const row = Math.floor(random() * 4);
  const left = Math.floor(random() * 3);
  const right = left + 1 + Math.floor(random() * (3 - left));
  cells[row * 4 + left] = 'R';
  cells[row * 4 + right] = 'L';
  const symbols = ['U', 'D', 'L', 'R'];
  while (cells.filter((cell) => cell !== '.').length < arrowCount) {
    const pos = Math.floor(random() * 16);
    if (cells[pos] === '.') cells[pos] = symbols[Math.floor(random() * symbols.length)];
  }
  return Array.from({ length: 4 }, (_, r) => cells.slice(r * 4, r * 4 + 4).join(''));
}

const command = process.argv[2] ?? 'verify';
if (command === 'discover') {
  const random = rng(20261020);
  const attempts = Number(process.argv[3] ?? 100);
  const found = [];
  const seen = new Set();
  let unsolved = 0;
  for (let i = 0; i < attempts; i++) {
    const arrows = 5 + Math.floor(random() * 6);
    const rows = sampleBoard(random, arrows);
    const layout = rows.join('/');
    if (seen.has(layout)) continue;
    seen.add(layout);
    const solution = solveLevel(makeLevel(rows));
    if (!solution) { unsolved++; continue; }
    const shifts = solution.actions.filter((action) => action.type === 'SHIFT_ROW').length;
    if (shifts >= 2 && solution.moves >= 10) {
      found.push({ rows, moves: solution.moves, arrows, shifts, visited: solution.visited });
    }
  }
  console.log(JSON.stringify({ checked: seen.size, unsolved, candidates: found.length }, null, 2));
  console.log(JSON.stringify(found, null, 2));
} else if (command === 'verify') {
  const { levels } = require('../src/game/levels.ts');
  let failed = 0;
  for (const level of levels) {
    const issues = validateLevel(level);
    const solution = solveLevel(level);
    const shifts = solution?.actions.filter((action) => action.type === 'SHIFT_ROW').length;
    if (issues.length || !solution || solution.moves !== level.parMoves) failed++;
    console.log(`${level.id}: par=${level.parMoves}, shortest=${solution?.moves ?? 'NONE'}, shifts=${shifts ?? 'NONE'}, visited=${solution?.visited ?? 'NONE'} ${issues.join(', ')}`);
  }
  if (failed) process.exitCode = 1;
} else {
  console.error('Usage: node scripts/level-authoring.mjs [discover <attempts>|verify]');
  process.exitCode = 2;
}
