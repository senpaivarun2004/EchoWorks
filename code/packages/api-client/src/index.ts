import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  Song,
  SongCreate,
  Lyrics,
  Playlist,
  PlaylistCreate,
  UserProgress,
  UserVocabulary,
  Exercise,
  ExerciseAttempt,
  VideoExportJob,
  VideoExportSettings,
  UploadPresignedUrl,
  UploadComplete,
} from '@lyricshare/types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class LyricShareClient {
  private client: AxiosInstance;

  constructor(baseURL: string = BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string | null) {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Songs
  async getSongs(params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Song>> {
    const { data } = await this.client.get('/api/songs', { params });
    return data;
  }

  async getSong(id: string): Promise<ApiResponse<Song>> {
    const { data } = await this.client.get(`/api/songs/${id}`);
    return data;
  }

  async createSong(song: SongCreate): Promise<ApiResponse<Song>> {
    const { data } = await this.client.post('/api/songs', song);
    return data;
  }

  async deleteSong(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const { data } = await this.client.delete(`/api/songs/${id}`);
    return data;
  }

  // Lyrics
  async getLyrics(songId: string): Promise<ApiResponse<Lyrics>> {
    const { data } = await this.client.get(`/api/songs/${songId}/lyrics`);
    return data;
  }

  async uploadLyrics(songId: string, content: string, format: string): Promise<ApiResponse<Lyrics>> {
    const { data } = await this.client.post(`/api/songs/${songId}/lyrics`, { content, format });
    return data;
  }

  // Upload
  async getUploadUrl(fileName: string, contentType: string): Promise<ApiResponse<UploadPresignedUrl>> {
    const { data } = await this.client.post('/api/upload/presigned', { fileName, contentType });
    return data;
  }

  async confirmUpload(fileKey: string): Promise<ApiResponse<UploadComplete>> {
    const { data } = await this.client.post('/api/upload/confirm', { fileKey });
    return data;
  }

  // Playlists
  async getPlaylists(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Playlist>> {
    const { data } = await this.client.get('/api/playlists', { params });
    return data;
  }

  async getPlaylist(id: string): Promise<ApiResponse<Playlist>> {
    const { data } = await this.client.get(`/api/playlists/${id}`);
    return data;
  }

  async createPlaylist(playlist: PlaylistCreate): Promise<ApiResponse<Playlist>> {
    const { data } = await this.client.post('/api/playlists', playlist);
    return data;
  }

  async addSongToPlaylist(playlistId: string, songId: string): Promise<ApiResponse<Playlist>> {
    const { data } = await this.client.post(`/api/playlists/${playlistId}/songs`, { songId });
    return data;
  }

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<ApiResponse<Playlist>> {
    const { data } = await this.client.delete(`/api/playlists/${playlistId}/songs/${songId}`);
    return data;
  }

  async deletePlaylist(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const { data } = await this.client.delete(`/api/playlists/${id}`);
    return data;
  }

  // Learning
  async getExercises(songId: string): Promise<ApiResponse<Exercise[]>> {
    const { data } = await this.client.get(`/api/learning/exercises/${songId}`);
    return data;
  }

  async submitExerciseAttempt(attempt: ExerciseAttempt): Promise<ApiResponse<{ correct: boolean; explanation: string }>> {
    const { data } = await this.client.post('/api/learning/attempts', attempt);
    return data;
  }

  async getVocabulary(songId: string): Promise<ApiResponse<UserVocabulary[]>> {
    const { data } = await this.client.get(`/api/learning/vocabulary/${songId}`);
    return data;
  }

  async getUserProgress(songId: string): Promise<ApiResponse<UserProgress>> {
    const { data } = await this.client.get(`/api/learning/progress/${songId}`);
    return data;
  }

  // Video Export
  async createVideoExport(request: { songId: string; settings: VideoExportSettings }): Promise<ApiResponse<VideoExportJob>> {
    const { data } = await this.client.post('/api/video/export', request);
    return data;
  }

  async getVideoExportStatus(jobId: string): Promise<ApiResponse<VideoExportJob>> {
    const { data } = await this.client.get(`/api/video/export/${jobId}`);
    return data;
  }

  // User
  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    const { data } = await this.client.get(`/api/users/${userId}`);
    return data;
  }

  async updateUserProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    const { data } = await this.client.patch('/api/users/me', updates);
    return data;
  }

  // Search
  async search(query: string, type?: 'songs' | 'playlists' | 'users'): Promise<ApiResponse<{ songs: Song[]; playlists: Playlist[] }>> {
    const { data } = await this.client.get('/api/search', { params: { q: query, type } });
    return data;
  }
}

export const api = new LyricShareClient();
export default LyricShareClient;
