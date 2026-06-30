# LyricShare

> Learn languages through music — share songs, read synced lyrics, and create beautiful lyric videos.

![Spotify-style lyrics demo](https://placehold.co/800x400/1a1a1a/22c55e?text=LyricShare+Demo)

## Features

### 🎵 Spotify-Style Lyric Display
Word-level highlighting that scrolls in real-time with the music. Tap any line to jump to that position in the song.

### 🌍 Language Learning
- Word-by-word translations and romanization
- Spaced Repetition System (SRS) vocabulary trainer
- Fill-in-the-blank, listening dictation, and translation match exercises
- Song difficulty ratings based on vocabulary, speed, and grammar

### 🎬 Video Export
Export synced lyric videos in 9:16, 16:9, or 1:1 aspect ratio. Perfect for TikTok, Reels, Shorts, or YouTube.

### 📱 Multi-Platform
Web, iOS, Android, and Desktop — all sharing a single Rust-powered sync engine.

### 🔗 Social & Sharing
- Upload your own songs with synced lyrics
- Create and share playlists
- Follow users and track learning progress
- Community-sourced translations

## Monorepo Structure

```
lyricshare/
├── apps/
│   ├── api/              # Rust Axum API server (PostgreSQL, S3, JWT auth)
│   ├── desktop/          # Tauri desktop app (Rust shell + web UI)
│   ├── mobile/           # Expo React Native app (iOS + Android)
│   └── web/              # Next.js 14 web app (Tailwind, dark theme)
│
├── core/
│   └── lyricshare-core/  # Rust → WASM: LRC/SRT parser, sync engine, frame renderer
│
└── packages/
    ├── api-client/        # Typed Axios client for all API endpoints
    ├── store/             # Zustand state management (player, UI, user)
    ├── types/             # Shared TypeScript types and Zod validation schemas
    ├── ui/                # React component library (LyricPlayer, AudioPlayer, etc.)
    └── utils/             # AudioEngine, formatters, debounce, and math utilities
```

## Quick Start

### Prerequisites

> **⚠️ PostgreSQL is required.** See [REQUIREMENTS.md](./REQUIREMENTS.md) for full install instructions.

| Tool       | Version     | Install                             |
|------------|-------------|-------------------------------------|
| Node.js    | >= 20.0.0   | `winget install OpenJS.NodeJS`      |
| pnpm       | >= 9.0.0    | `npm install -g pnpm`               |
| Rust       | >= 1.78     | `winget install Rustlang.Rustup`    |
| PostgreSQL | >= 16       | `winget install PostgreSQL.PostgreSQL` |

### Install

```bash
pnpm install
```

### Database Setup

```bash
# 1. Install PostgreSQL (one-time)
winget install PostgreSQL.PostgreSQL

# 2. Create the database
psql -U postgres -c "CREATE DATABASE lyricshare;"

# 3. Configure connection
cp apps/api/.env.example apps/api/.env
# Edit DATABASE_URL in apps/api/.env with your password
```

### Run Everything

```bash
# Terminal 1 — API server
cd apps/api && cargo run

# Terminal 2 — Web app
cd apps/web && pnpm dev

# Terminal 3 — WASM build (one-time)
cd core/lyricshare-core
wasm-pack build --target web
```

### Platform-Specific

```bash
# Mobile (Expo)
cd apps/mobile && npx expo start

# Desktop (Tauri)
cd apps/desktop && pnpm tauri dev
```

### Verify

```bash
# API health check
curl http://localhost:3001/api/health
# → "OK"

# List songs
curl http://localhost:3001/api/songs
```

## Commands

| Command              | Description                  |
|----------------------|------------------------------|
| `pnpm dev`           | Run all dev servers          |
| `pnpm build`         | Build all packages and apps  |
| `pnpm lint`          | Lint all TypeScript          |
| `pnpm typecheck`     | TypeScript type checking     |
| `pnpm test`          | Run all tests                |
| `pnpm format`        | Format code with Prettier    |
| `pnpm clean`         | Remove all build artifacts   |

## API Overview

| Endpoint               | Method | Description               |
|------------------------|--------|---------------------------|
| `/api/auth/register`   | POST   | Create account            |
| `/api/auth/login`      | POST   | Sign in                   |
| `/api/songs`           | GET    | List songs                |
| `/api/songs`           | POST   | Upload a song             |
| `/api/songs/:id/lyrics`| GET    | Get lyrics for a song     |
| `/api/playlists`       | GET    | List playlists            |
| `/api/playlists`       | POST   | Create playlist           |
| `/api/learning/exercises/:songId` | GET | Get exercises    |
| `/api/learning/vocabulary/:songId` | GET | Get vocabulary    |
| `/api/video/export`    | POST   | Start video export        |
| `/api/search?q=`       | GET    | Search songs & playlists  |

## Architecture

```

[Web]  [Mobile]  [Desktop]
    \      |      /
     ═══════════════        React UI (packages/ui)
           │
     ═══════════════        WASM core (Rust → browser)
           │
      [REST API]            Rust Axum server
           │
  ┌────────┴────────┐
  │                  │
PostgreSQL         S3/MinIO
(Database)       (Audio/Video/Images)
```

The Rust WASM core runs the LRC/SRT parser and sync engine **in the browser/client**, enabling real-time 60fps lyric updates without server round-trips.

## License

MIT
