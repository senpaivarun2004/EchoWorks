'use client';

import { useState } from 'react';
import { Button, Card, AudioPlayer, LyricPlayer, SeekBar, PlayPauseButton, ProgressBar } from '@lyricshare/ui';
import type { LyricLine } from '@lyricshare/types';

const DEMO_LYRICS: LyricLine[] = [
  {
    index: 0, text: 'Hello from the other side', startTime: 0, endTime: 3,
    words: [
      { word: 'Hello', startTime: 0, endTime: 0.6 },
      { word: 'from', startTime: 0.6, endTime: 1 },
      { word: 'the', startTime: 1, endTime: 1.3 },
      { word: 'other', startTime: 1.3, endTime: 1.8 },
      { word: 'side', startTime: 1.8, endTime: 3 },
    ]
  },
  {
    index: 1, text: 'I must have called a thousand times', startTime: 3, endTime: 6,
    words: [
      { word: 'I', startTime: 3, endTime: 3.3 },
      { word: 'must', startTime: 3.3, endTime: 3.6 },
      { word: 'have', startTime: 3.6, endTime: 3.9 },
      { word: 'called', startTime: 3.9, endTime: 4.3 },
      { word: 'a', startTime: 4.3, endTime: 4.4 },
      { word: 'thousand', startTime: 4.4, endTime: 5 },
      { word: 'times', startTime: 5, endTime: 6 },
    ]
  },
  {
    index: 2, text: 'To tell you I am sorry', startTime: 6, endTime: 8.5,
    words: [
      { word: 'To', startTime: 6, endTime: 6.2 },
      { word: 'tell', startTime: 6.2, endTime: 6.5 },
      { word: 'you', startTime: 6.5, endTime: 6.7 },
      { word: 'I', startTime: 6.7, endTime: 6.9 },
      { word: 'am', startTime: 6.9, endTime: 7.2 },
      { word: 'sorry', startTime: 7.2, endTime: 8.5 },
    ]
  },
  {
    index: 3, text: 'For breaking my own heart', startTime: 8.5, endTime: 11,
    words: [
      { word: 'For', startTime: 8.5, endTime: 8.8 },
      { word: 'breaking', startTime: 8.8, endTime: 9.3 },
      { word: 'my', startTime: 9.3, endTime: 9.5 },
      { word: 'own', startTime: 9.5, endTime: 9.8 },
      { word: 'heart', startTime: 9.8, endTime: 11 },
    ]
  },
];

export default function HomePage() {
  const [showLyrics, setShowLyrics] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 3v12.26c-.5-.17-1-.26-1.5-.26C8.5 15 7 16.5 7 18.5S8.5 22 10.5 22s3.5-1.5 3.5-3.5V7h4V3h-6z" />
              </svg>
            </div>
            <span className="text-xl font-bold">LyricShare</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Discover</Button>
            <Button variant="ghost" size="sm">My Library</Button>
            <Button variant="secondary" size="sm">Upload</Button>
            <Button size="sm">Sign In</Button>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
            Learn Languages Through Music
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Share songs, read synced lyrics, learn vocabulary, and create beautiful lyric videos
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button size="lg">Get Started</Button>
            <Button variant="secondary" size="lg">Explore Songs</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Spotify-Style Lyrics</h2>
            <div className="h-[400px] rounded-xl bg-white/5 overflow-hidden">
              <LyricPlayer
                lines={DEMO_LYRICS}
                currentLineIndex={showLyrics ? 0 : -1}
                currentWordIndex={showLyrics ? 2 : -1}
                lineProgress={showLyrics ? 0.6 : 0}
                translations={{ 0: 'Hola desde el otro lado' }}
                showTranslation={true}
              />
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Language Learning</h2>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-sm">1</span>
                  Word-by-word translation & romanization
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-sm">2</span>
                  Spaced repetition vocabulary trainer
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-sm">3</span>
                  Fill-in-the-blank & listening exercises
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-sm">4</span>
                  Difficulty ratings & progress tracking
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Video Export</h2>
              <p className="text-white/60 mb-4">
                Export synced lyric videos for TikTok, Reels, or YouTube
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">9:16</Button>
                <Button size="sm" variant="secondary">16:9</Button>
                <Button size="sm" variant="secondary">1:1</Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <AudioPlayer
            audioUrl=""
            lyrics={DEMO_LYRICS}
            title="Hello"
            artist="Adele (Demo)"
            showTranslation={true}
            className="max-w-2xl mx-auto"
          />
        </div>
      </section>
    </main>
  );
}
