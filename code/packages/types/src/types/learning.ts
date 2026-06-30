export type ExerciseType = 'fill-blank' | 'translation-match' | 'listening-dictation' | 'word-order' | 'multiple-choice';

export interface Exercise {
  id: string;
  songId: string;
  type: ExerciseType;
  question: string;
  correctAnswer: string;
  options: string[] | null;
  hint: string | null;
  difficulty: 1 | 2 | 3;
  lyricLineIndex: number | null;
  createdAt: string;
}

export interface ExerciseAttempt {
  id: string;
  userId: string;
  exerciseId: string;
  answer: string;
  isCorrect: boolean;
  timeSpentMs: number;
  createdAt: string;
}

export interface SongDifficulty {
  songId: string;
  overallScore: number; // 1-10
  vocabularyScore: number;
  grammarScore: number;
  speedScore: number;
  accentScore: number;
  vocabularyCount: number;
  uniqueWords: number;
  wordsPerMinute: number;
}

export interface LearningSession {
  id: string;
  userId: string;
  songId: string;
  startedAt: string;
  endedAt: string | null;
  exercisesCompleted: number;
  exercisesCorrect: number;
  wordsLearned: number;
  durationMinutes: number;
}
