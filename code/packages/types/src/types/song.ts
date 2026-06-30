export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  duration: number; // seconds
  coverUrl: string | null;
  audioUrl: string;
  language: string;
  source: 'upload' | 'spotify' | 'youtube' | 'genius';
  sourceId: string | null;
  genre: string[];
  releaseYear: number | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  difficulty: 1 | 2 | 3 | 4 | 5 | null;
}

export interface SongCreate {
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
  language: string;
  source: Song['source'];
  sourceId?: string;
  genre?: string[];
  releaseYear?: number;
}
