export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  userId: string;
  songs: string[]; // song IDs
  isPublic: boolean;
  isCollaborative: boolean;
  collaborators: string[]; // user IDs
  songCount: number;
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistCreate {
  name: string;
  description?: string;
  coverUrl?: string;
  songs?: string[];
  isPublic?: boolean;
  isCollaborative?: boolean;
}
