export type VideoAspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export type VideoExportMode = 'karaoke' | 'line-scroll' | 'static';

export type VideoBackgroundType = 'gradient' | 'color' | 'image' | 'video';

export interface VideoExportSettings {
  aspectRatio: VideoAspectRatio;
  fps: number;
  quality: 'low' | 'medium' | 'high';
  mode: VideoExportMode;
  background?: {
    type: VideoBackgroundType;
    value: string;
    gradient?: string[];
  };
  font?: {
    family: string;
    size: number;
    color: string;
    highlightColor: string;
  };
  showTranslation: boolean;
  showRomanization: boolean;
  watermark: string | null;
  includeCover: boolean;
}

export interface VideoExportRequest {
  songId: string;
  settings: VideoExportSettings;
  startTime?: number;
  endTime?: number;
}

export interface VideoExportJob {
  id: string;
  userId: string;
  songId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  settings: VideoExportSettings;
  outputUrl: string | null;
  progress: number;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
}
