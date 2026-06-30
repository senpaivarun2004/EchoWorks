import React from 'react';
import { AudioPlayer } from '@lyricshare/ui';
import type { LyricLine } from '@lyricshare/types';

function App() {
  return (
    <main className="h-screen bg-black text-white flex flex-col">
      <header className="px-6 py-4 border-b border-white/5">
        <h1 className="text-xl font-bold">LyricShare Desktop</h1>
      </header>
      <div className="flex-1 flex">
        <nav className="w-56 border-r border-white/5 p-4 space-y-2">
          <p className="text-sm text-white/40 uppercase tracking-wider">Library</p>
          <p className="text-sm text-white/80 cursor-pointer hover:text-white">Songs</p>
          <p className="text-sm text-white/80 cursor-pointer hover:text-white">Playlists</p>
          <p className="text-sm text-white/80 cursor-pointer hover:text-white">Vocabulary</p>
          <p className="text-sm text-white/40 uppercase tracking-wider mt-6">Discover</p>
          <p className="text-sm text-white/80 cursor-pointer hover:text-white">Trending</p>
          <p className="text-sm text-white/80 cursor-pointer hover:text-white">Languages</p>
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-48 h-48 rounded-2xl bg-white/5 mx-auto mb-6" />
            <h2 className="text-2xl font-bold">Welcome to LyricShare</h2>
            <p className="text-white/40 mt-2">Select a song to start learning</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
