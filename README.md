# 🎵 EchoWorks

> **Learn languages through music** — share songs, read synchronized lyrics, and master vocabulary with an AI-assisted sync engine.

![EchoWorks Banner](./assets/banner.png)

<div align="center">

[![Rust](https://img.shields.io/badge/Rust-1.78+-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-1.x-FFC131?style=for-the-badge&logo=tauri&logoColor=black)](https://tauri.app/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![WASM](https://img.shields.io/badge/WebAssembly-WASM-654FF0?style=for-the-badge&logo=webassembly&logoColor=white)](https://webassembly.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)

</div>

---

EchoWorks (formerly known as LyricShare) is a modern, high-performance monorepo application designed to make language learning natural, engaging, and music-driven. Powered by a lightning-fast Rust core compiled to WebAssembly, it parses synced lyrics and renders audio-visual frames in real-time right in your browser.

---

## ✨ Features

### 🎤 Spotify-Style Lyric Engine
*   **Word-Level Highlighting:** Lyrics highlight and scroll dynamically in sync with the audio track.
*   **Interactive Playback:** Tap or click any lyric line to instantly jump to that timestamp.

### 🧠 Language Learning & SRS
*   **Word Translations & Romanization:** Get immediate definitions, pronunciation guides, and romanized text for unfamiliar words.
*   **Spaced Repetition System (SRS):** Built-in vocabulary trainer that schedules reviews based on your memory curves.
*   **Interactive Exercises:** Reinforce learning with fill-in-the-blanks, dictations, and translation matching.
*   **Difficulty Scoring:** Automatically rates song difficulty based on vocab diversity, speed, and grammar complexity.

### 🎬 Video Export Studio
*   **Social-Ready Formats:** Render and export synced lyric videos in multiple aspect ratios:
    *   **Vertical (9:16)** (TikTok, Reels, Shorts)
    *   **Landscape (16:9)** (YouTube)
    *   **Square (1:1)** (Instagram Feed)

### 🚀 Cross-Platform
*   **Web App:** Next.js 14 web app with elegant dark mode.
*   **Desktop App:** Tauri shell utilizing the shared Rust backend and web frontend.
*   **Mobile App:** Expo React Native app compiling to native iOS and Android.

---

## 📂 Monorepo Structure

All components are managed within a unified workspace inside the [`/code`](./code) folder:

```
EchoWorks/
├── assets/                # Static visual assets and banners
└── code/                  # Main Monorepo Workspace
    ├── apps/
    │   ├── api/           # Rust Axum API server (PostgreSQL database, S3/MinIO, JWT auth)
    │   ├── desktop/       # Tauri Desktop App (Rust shell + Next.js web client)
    │   ├── mobile/        # Expo React Native App (iOS & Android clients)
    │   └── web/           # Next.js 14 Web Portal (Tailwind CSS, sleek dark UI)
    │
    ├── core/
    │   └── lyricshare-core/  # Rust Core (LRC/SRT parsers, WASM sync engine, frame renderer)
    │
    └── packages/
        ├── api-client/    # Fully-typed Axios client for seamless API integration
        ├── store/         # Zustand state machines (global audio player, UI, and auth state)
        ├── types/         # Shared TypeScript interfaces & Zod validation schemas
        ├── ui/            # Shared React UI component library (LyricPlayer, AudioPlayer)
        └── utils/         # Core utility functions (AudioEngine, math, formatting)
```

---

## ⚙️ Quick Start

Ensure you have the required runtimes installed:

*   **Node.js** `>= 20.0.0`
*   **pnpm** `>= 9.0.0`
*   **Rust** `>= 1.78`
*   **PostgreSQL** `>= 16`

For detailed setup, configuration guides, and troubleshooting, see the [System Requirements](./code/REQUIREMENTS.md) guide.

### 1. Installation

Navigate into the codebase folder and install the dependencies:

```bash
cd code
pnpm install
```

### 2. Database Configuration

Create a PostgreSQL database and copy the example environment configuration:

```bash
# Create the postgres database
psql -U postgres -c "CREATE DATABASE lyricshare;"

# Copy environment template
cp apps/api/.env.example apps/api/.env
```

Update `apps/api/.env` with your local PostgreSQL user password:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/lyricshare
```

### 3. Build & Run

From the `code/` directory, launch the services:

#### ⚡ Start Development Workspace (Web + Dev tools)
```bash
pnpm dev
```

#### 🦀 Run the API Service
```bash
cd apps/api
cargo run
```

#### 📦 Build the WebAssembly Core
```bash
cd core/lyricshare-core
wasm-pack build --target web
```

#### 📱 Launch Mobile (Expo)
```bash
cd apps/mobile
npx expo start
```

#### 💻 Launch Desktop (Tauri)
```bash
cd apps/desktop
pnpm tauri dev
```

---

## 🛠️ CLI Script Index

Run these commands inside the `code/` directory:

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts all development server applications concurrently |
| `pnpm build` | Compiles and builds all packages and applications |
| `pnpm build:wasm` | Automatically compiles Rust engine to WebAssembly targets |
| `pnpm lint` | Evaluates and lints all TypeScript and UI codebases |
| `pnpm typecheck` | Validates TypeScript types across the workspaces |
| `pnpm test` | Runs the test suites across the packages |
| `pnpm format` | Formats all code with Prettier (`.ts`, `.json`, `.md`, `.rs`) |
| `pnpm clean` | Wipes out compile artifacts and `node_modules` caches |

---

## 🔌 API Endpoints Reference

| Route | Method | Purpose |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Create a new user account |
| `/api/auth/login` | `POST` | Exchange credentials for a JWT token |
| `/api/songs` | `GET` / `POST` | Fetch all tracks / Upload a new music file |
| `/api/songs/:id/lyrics` | `GET` | Retrieve structured interactive lyrics for a track |
| `/api/playlists` | `GET` / `POST` | List user playlists / Create a new playlist |
| `/api/learning/exercises/:songId`| `GET` | Generate learning challenges and questions |
| `/api/learning/vocabulary/:songId`| `GET` | List target vocabulary words for review |
| `/api/video/export` | `POST` | Dispatch visual export job (renders lyric video) |

---

## 📐 Architecture Flow

```
   ┌──────────────────────────────────────────┐
   │    Web App    │  Mobile App  │ Desktop   │
   └──────────────────────────────────────────┘
                         │
        Shared React UI Components (packages/ui)
                         │
        WASM Sync Engine (Rust → compiled to WASM)
                         │
               HTTP JSON REST API
                         │
              Rust Axum Backend Router
               ┌─────────┴─────────┐
               ▼                   ▼
         PostgreSQL DB        S3 Object Store
        (User/Vocab Data)    (Audio/Video Files)
```

The Rust WASM core handles parsing lyric documents (LRC/SRT files) directly on the client, rendering frames locally without hitting server APIs.

---

## 📄 License

This project is licensed under the [MIT License](./code/LICENSE) (or see workspace package configurations).
