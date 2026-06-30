export interface LyricWord {
  word: string;
  startTime: number; // seconds
  endTime: number;
}

export interface LyricLine {
  index: number;
  text: string;
  startTime: number;
  endTime: number;
  words: LyricWord[];
}

export interface Lyrics {
  id: string;
  songId: string;
  format: 'lrc' | 'srt' | 'json';
  lines: LyricLine[];
  language: string;
  isSynced: boolean;
  syncedByUserId: string | null;
  source: 'upload' | 'genius' | 'musixmatch' | 'community';
  timestamps: Timestamp[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface Timestamp {
  start: number;
  end: number;
}

export interface Translation {
  id: string;
  lyricLineId: string;
  lyricLineIndex: number;
  language: string;
  text: string;
  romanization: string | null;
  contributorId: string;
  createdAt: string;
}

export interface LyricLineWithTranslation extends LyricLine {
  translation: string | null;
  romanization: string | null;
}

export type LyricSyncState = 'synced' | 'partial' | 'unsynced';
