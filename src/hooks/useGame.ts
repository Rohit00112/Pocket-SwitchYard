import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { applyGameAction, createInitialGame, findArrow } from '@/game/engine';
import type { GameAction, GameState, LevelDefinition } from '@/game/types';

export type BoardAnimation =
  | { readonly type: 'EXIT_ARROW'; readonly arrowId: string }
  | { readonly type: 'SHIFT_ROW'; readonly row: number; readonly direction: 'LEFT' | 'RIGHT' };

export function useGame(level: LevelDefinition, reducedMotion = false, onBlocked?: () => void, onMoved?: () => void) {
  const [state, setState] = useState<GameState>(() => createInitialGame(level));
  const stateRef = useRef(state);
  const pendingRef = useRef<GameAction | null>(null);
  const busyRef = useRef(false);
  const [animation, setAnimation] = useState<BoardAnimation | null>(null);
  const [blocked, setBlocked] = useState<{ arrowId: string; nonce: number } | null>(null);
  const blockedCount = useRef(0);

  const update = useCallback((next: GameState) => { stateRef.current = next; setState(next); }, []);

  const finishAnimation = useCallback(() => {
    const pending = pendingRef.current;
    if (!pending) return;
    pendingRef.current = null;
    const result = applyGameAction(stateRef.current, pending, level);
    if (result.changed) update(result.state);
    setAnimation(null);
    busyRef.current = false;
  }, [level, update]);

  // Backgrounding while the UI thread is animating must never leave inputs locked.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active' && busyRef.current) finishAnimation();
    });
    return () => subscription.remove();
  }, [finishAnimation]);

  const requestMove = useCallback((action: GameAction) => {
    if (busyRef.current) return;
    const result = applyGameAction(stateRef.current, action, level);
    if (!result.changed) {
      if (result.reason === 'blocked' && action.type === 'EXIT_ARROW') {
        onBlocked?.();
        blockedCount.current++;
        setBlocked({ arrowId: action.arrowId, nonce: blockedCount.current });
      }
      return;
    }
    if (action.type === 'EXIT_ARROW' || action.type === 'SHIFT_ROW') {
      onMoved?.();
      if (reducedMotion) {
        update(result.state);
        setBlocked(null);
        return;
      }
      busyRef.current = true; // Synchronous guard against multi-taps within the same frame.
      pendingRef.current = action;
      setBlocked(null);
      setAnimation(action);
    } else {
      setBlocked(null);
      update(result.state);
    }
  }, [level, onBlocked, onMoved, reducedMotion, update]);

  const exitArrow = useCallback((arrowId: string) => {
    if (!findArrow(stateRef.current.board, arrowId)) return;
    requestMove({ type: 'EXIT_ARROW', arrowId });
  }, [requestMove]);
  const shift = useCallback((row: number, direction: 'LEFT' | 'RIGHT') => requestMove({ type: 'SHIFT_ROW', row, direction }), [requestMove]);
  const undo = useCallback(() => requestMove({ type: 'UNDO' }), [requestMove]);
  const restart = useCallback(() => requestMove({ type: 'RESTART' }), [requestMove]);
  const togglePause = useCallback(() => requestMove({ type: stateRef.current.status === 'paused' ? 'RESUME' : 'PAUSE' }), [requestMove]);

  return { state, animation, blocked, exitArrow, shift, undo, restart, togglePause, finishAnimation, busy: !!animation };
}
