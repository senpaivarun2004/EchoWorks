CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(30) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    native_language VARCHAR(10) NOT NULL DEFAULT 'en',
    learning_languages TEXT[] NOT NULL DEFAULT '{"en"}',
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Songs
CREATE TABLE IF NOT EXISTS songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255),
    duration DOUBLE PRECISION NOT NULL,
    cover_url TEXT,
    audio_url TEXT NOT NULL,
    language VARCHAR(10) NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'upload',
    source_id TEXT,
    genre TEXT[] NOT NULL DEFAULT '{}',
    release_year INTEGER,
    difficulty INTEGER,
    play_count BIGINT NOT NULL DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lyrics
CREATE TABLE IF NOT EXISTS lyrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    format VARCHAR(10) NOT NULL DEFAULT 'lrc',
    content TEXT NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'unknown',
    is_synced BOOLEAN NOT NULL DEFAULT false,
    synced_by_user_id UUID REFERENCES users(id),
    source VARCHAR(50) NOT NULL DEFAULT 'upload',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Translations
CREATE TABLE IF NOT EXISTS translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    lyric_line_index INTEGER NOT NULL,
    language VARCHAR(10) NOT NULL,
    text TEXT NOT NULL,
    romanization TEXT,
    contributor_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(song_id, lyric_line_index, language)
);

-- Playlists
CREATE TABLE IF NOT EXISTS playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    songs UUID[] NOT NULL DEFAULT '{}',
    is_public BOOLEAN NOT NULL DEFAULT true,
    is_collaborative BOOLEAN NOT NULL DEFAULT false,
    collaborators UUID[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vocabulary
CREATE TABLE IF NOT EXISTS vocabulary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word VARCHAR(255) NOT NULL,
    language VARCHAR(10) NOT NULL,
    translation TEXT NOT NULL,
    romanization TEXT,
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    context_line TEXT NOT NULL,
    frequency INTEGER NOT NULL DEFAULT 1,
    mastery_level INTEGER NOT NULL DEFAULT 0,
    srs_due TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_reviewed TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, word, language)
);

-- Exercises
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    exercise_type VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options TEXT[],
    hint TEXT,
    difficulty INTEGER NOT NULL DEFAULT 1,
    lyric_line_index INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exercise attempts
CREATE TABLE IF NOT EXISTS exercise_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_ms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User progress
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    progress_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
    last_position DOUBLE PRECISION NOT NULL DEFAULT 0,
    completed_lines INTEGER NOT NULL DEFAULT 0,
    mastery_score DOUBLE PRECISION,
    times_played INTEGER NOT NULL DEFAULT 0,
    last_played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, song_id)
);

-- Video export jobs
CREATE TABLE IF NOT EXISTS video_export_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    settings JSONB NOT NULL DEFAULT '{}',
    output_url TEXT,
    progress DOUBLE PRECISION NOT NULL DEFAULT 0,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);
CREATE INDEX IF NOT EXISTS idx_songs_language ON songs(language);
CREATE INDEX IF NOT EXISTS idx_lyrics_song_id ON lyrics(song_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_user_id ON vocabulary(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_srs_due ON vocabulary(srs_due);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_video_export_jobs_user_id ON video_export_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
