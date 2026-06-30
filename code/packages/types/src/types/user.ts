export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  nativeLanguage: string;
  learningLanguages: string[];
  role: 'user' | 'moderator' | 'admin';
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalSongsPlayed: number;
  totalListeningMinutes: number;
  vocabularyLearned: number;
  songsUploaded: number;
  contributions: number;
  streak: number;
}

export interface UserProgress {
  userId: string;
  songId: string;
  progressPercent: number;
  lastPosition: number;
  completedLines: number;
  masteryScore: number | null;
  timesPlayed: number;
  lastPlayedAt: string;
  updatedAt: string;
}

export interface UserVocabulary {
  id: string;
  userId: string;
  word: string;
  language: string;
  translation: string;
  romanization: string | null;
  songId: string;
  contextLine: string;
  frequency: number;
  masteryLevel: number; // 0-5
  srsDue: string;
  lastReviewed: string | null;
  createdAt: string;
}
