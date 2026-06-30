import { z } from 'zod';

export const SongCreateSchema = z.object({
  title: z.string().min(1).max(255),
  artist: z.string().min(1).max(255),
  album: z.string().max(255).optional().nullable(),
  duration: z.number().positive(),
  coverUrl: z.string().url().optional().nullable(),
  audioUrl: z.string().url(),
  language: z.string().min(2).max(10),
  source: z.enum(['upload', 'spotify', 'youtube', 'genius']),
  sourceId: z.string().optional().nullable(),
  genre: z.array(z.string()).optional().default([]),
  releaseYear: z.number().int().min(1900).max(2030).optional().nullable(),
});

export const PlaylistCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
  songs: z.array(z.string()).optional().default([]),
  isPublic: z.boolean().optional().default(true),
  isCollaborative: z.boolean().optional().default(false),
});

export const ExerciseAttemptSchema = z.object({
  exerciseId: z.string(),
  answer: z.string(),
  timeSpentMs: z.number().int().nonnegative(),
});

export const VideoExportSettingsSchema = z.object({
  aspectRatio: z.enum(['9:16', '16:9', '1:1', '4:5']).default('9:16'),
  fps: z.number().int().min(15).max(60).default(30),
  quality: z.enum(['low', 'medium', 'high']).default('medium'),
  mode: z.enum(['karaoke', 'line-scroll', 'static']).default('karaoke'),
  showTranslation: z.boolean().default(true),
  showRomanization: z.boolean().default(false),
  includeCover: z.boolean().default(true),
  watermark: z.string().nullable().default(null),
});

export const QueryOptionsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  direction: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

export const UserUpdateSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  nativeLanguage: z.string().min(2).max(10).optional(),
  learningLanguages: z.array(z.string().min(2).max(10)).optional(),
});

export type SongCreateType = z.infer<typeof SongCreateSchema>;
export type PlaylistCreateType = z.infer<typeof PlaylistCreateSchema>;
export type ExerciseAttemptType = z.infer<typeof ExerciseAttemptSchema>;
export type VideoExportSettingsType = z.infer<typeof VideoExportSettingsSchema>;
export type QueryOptionsType = z.infer<typeof QueryOptionsSchema>;
export type UserUpdateType = z.infer<typeof UserUpdateSchema>;
