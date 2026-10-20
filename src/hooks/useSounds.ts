import { useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

export function useSounds(enabled: boolean) {
  const move = useAudioPlayer(require('../../assets/sounds/move.wav'));
  const blocked = useAudioPlayer(require('../../assets/sounds/blocked.wav'));
  const win = useAudioPlayer(require('../../assets/sounds/win.wav'));
  const play = useCallback((kind: 'move' | 'blocked' | 'win') => {
    if (!enabled) return;
    const player = kind === 'move' ? move : kind === 'blocked' ? blocked : win;
    void player.seekTo(0).then(() => player.play()).catch(() => {});
  }, [enabled, move, blocked, win]);
  return play;
}
