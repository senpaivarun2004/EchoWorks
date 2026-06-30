import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface PlayerState {
  currentSongId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  repeatMode: 'none' | 'one' | 'all';
  shuffle: boolean;
  queue: string[];
  queueIndex: number;
}

export interface UIState {
  showLyrics: boolean;
  showKaraokeMode: boolean;
  showTranslation: boolean;
  showRomanization: boolean;
  sidebarOpen: boolean;
  miniPlayerVisible: boolean;
}

export interface AppState {
  player: PlayerState;
  ui: UIState;
  user: import('@lyricshare/types').User | null;
  currentSong: import('@lyricshare/types').Song | null;

  // Player actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: PlayerState['repeatMode']) => void;
  toggleShuffle: () => void;
  loadSong: (songId: string) => void;
  playNext: () => void;
  playPrev: () => void;

  // UI actions
  toggleShowLyrics: () => void;
  toggleKaraokeMode: () => void;
  toggleTranslation: () => void;
  toggleRomanization: () => void;
  toggleSidebar: () => void;
  setMiniPlayerVisible: (visible: boolean) => void;

  // User actions
  setUser: (user: import('@lyricshare/types').User | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  immer((set) => ({
    player: {
      currentSongId: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
      isMuted: false,
      playbackRate: 1,
      repeatMode: 'none',
      shuffle: false,
      queue: [],
      queueIndex: -1,
    },
    ui: {
      showLyrics: false,
      showKaraokeMode: false,
      showTranslation: false,
      showRomanization: false,
      sidebarOpen: true,
      miniPlayerVisible: false,
    },
    user: null,
    currentSong: null,

    // Player actions
    play: () =>
      set((state) => {
        state.player.isPlaying = true;
      }),

    pause: () =>
      set((state) => {
        state.player.isPlaying = false;
      }),

    togglePlay: () =>
      set((state) => {
        state.player.isPlaying = !state.player.isPlaying;
      }),

    setCurrentTime: (time) =>
      set((state) => {
        state.player.currentTime = time;
      }),

    setDuration: (duration) =>
      set((state) => {
        state.player.duration = duration;
      }),

    setVolume: (volume) =>
      set((state) => {
        state.player.volume = Math.max(0, Math.min(1, volume));
        state.player.isMuted = volume === 0;
      }),

    toggleMute: () =>
      set((state) => {
        state.player.isMuted = !state.player.isMuted;
      }),

    setPlaybackRate: (rate) =>
      set((state) => {
        state.player.playbackRate = rate;
      }),

    setRepeatMode: (mode) =>
      set((state) => {
        state.player.repeatMode = mode;
      }),

    toggleShuffle: () =>
      set((state) => {
        state.player.shuffle = !state.player.shuffle;
      }),

    loadSong: (songId) =>
      set((state) => {
        state.player.currentSongId = songId;
        state.player.currentTime = 0;
        state.player.isPlaying = true;
      }),

    playNext: () =>
      set((state) => {
        if (state.player.queue.length === 0) return;
        const nextIndex = (state.player.queueIndex + 1) % state.player.queue.length;
        state.player.queueIndex = nextIndex;
        state.player.currentSongId = state.player.queue[nextIndex];
        state.player.currentTime = 0;
        state.player.isPlaying = true;
      }),

    playPrev: () =>
      set((state) => {
        if (state.player.queue.length === 0) return;
        const prevIndex =
          state.player.queueIndex <= 0
            ? state.player.queue.length - 1
            : state.player.queueIndex - 1;
        state.player.queueIndex = prevIndex;
        state.player.currentSongId = state.player.queue[prevIndex];
        state.player.currentTime = 0;
        state.player.isPlaying = true;
      }),

    // UI actions
    toggleShowLyrics: () =>
      set((state) => {
        state.ui.showLyrics = !state.ui.showLyrics;
      }),

    toggleKaraokeMode: () =>
      set((state) => {
        state.ui.showKaraokeMode = !state.ui.showKaraokeMode;
      }),

    toggleTranslation: () =>
      set((state) => {
        state.ui.showTranslation = !state.ui.showTranslation;
      }),

    toggleRomanization: () =>
      set((state) => {
        state.ui.showRomanization = !state.ui.showRomanization;
      }),

    toggleSidebar: () =>
      set((state) => {
        state.ui.sidebarOpen = !state.ui.sidebarOpen;
      }),

    setMiniPlayerVisible: (visible) =>
      set((state) => {
        state.ui.miniPlayerVisible = visible;
      }),

    // User actions
    setUser: (user) =>
      set((state) => {
        state.user = user;
      }),

    logout: () =>
      set((state) => {
        state.user = null;
      }),
  }))
);
