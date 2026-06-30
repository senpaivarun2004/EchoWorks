import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { PlayPauseButton } from './PlayPauseButton';
import { SeekBar } from './SeekBar';
import { VolumeControl } from './VolumeControl';
import { LyricPlayer } from '../lyrics/LyricPlayer';
import type { LyricLine } from '@lyricshare/types';

interface AudioPlayerProps {
  audioUrl: string;
  lyrics: LyricLine[];
  translations?: Record<number, string>;
  romanizations?: Record<number, string>;
  showTranslation?: boolean;
  showRomanization?: boolean;
  coverUrl?: string;
  title?: string;
  artist?: string;
  className?: string;
}

export function AudioPlayer({
  audioUrl,
  lyrics,
  translations,
  romanizations,
  showTranslation = false,
  showRomanization = false,
  coverUrl,
  title,
  artist,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showLyrics, setShowLyrics] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  }, []);

  // Find current line index from currentTime
  const currentLineIndex = lyrics.findIndex(
    (line, i) => currentTime >= line.startTime && (i === lyrics.length - 1 || currentTime < lyrics[i + 1].startTime)
  );
  const activeLineIndex = currentLineIndex >= 0 ? currentLineIndex : 0;

  return (
    <div className={cn('flex flex-col', className)}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex-1 flex flex-col">
        {showLyrics ? (
          <LyricPlayer
            lines={lyrics}
            currentLineIndex={activeLineIndex}
            currentWordIndex={-1}
            lineProgress={0}
            translations={translations}
            romanizations={romanizations}
            showTranslation={showTranslation}
            showRomanization={showRomanization}
            onLineClick={(i) => handleSeek(lyrics[i]?.startTime ?? 0)}
            className="flex-1"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt={title ?? ''}
                  className="w-64 h-64 rounded-2xl shadow-2xl mb-6 object-cover mx-auto"
                />
              )}
              {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
              {artist && <p className="text-white/60 mt-1">{artist}</p>}
              <button
                onClick={() => setShowLyrics(true)}
                className="mt-4 text-sm text-accent-400 hover:text-accent-300 transition-colors"
              >
                Show lyrics
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-4 bg-black/40 backdrop-blur-xl border-t border-white/5">
        <SeekBar
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          className="mb-3"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className={cn(
                'text-sm transition-colors',
                showLyrics ? 'text-accent-400' : 'text-white/40 hover:text-white'
              )}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </button>
            <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
          </div>

          <PlayPauseButton isPlaying={isPlaying} onToggle={togglePlay} />

          <div className="w-20" />
        </div>
      </div>
    </div>
  );
}
