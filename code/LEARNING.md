# Learning with LyricShare

LyricShare turns any song into a language lesson. Here's how the learning system works.

## Core Concept

Music is one of the most effective tools for language acquisition:
- **Repetition** — Songs naturally repeat vocabulary and phrases
- **Context** — Words are learned in emotional, memorable contexts
- **Rhythm** — Musical rhythm aids pronunciation and retention
- **Engagement** — Learners spend more time with music than textbooks

## Learning Features

### 1. Synced Lyrics with Translations

Every song displays synced lyrics with word-level highlighting. Tap any word to see:

```
     Hello            from           the           other         side
 ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
 │  Hello  │    │  from   │    │   the   │    │  other  │    │  side   │
 │ ¡Hola!  │    │  desde  │    │   el    │    │  otro   │    │  lado   │
 └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

**Features:**
- Toggle translations on/off per line
- Romanization for non-Latin scripts (Japanese, Korean, Arabic, etc.)
- Tap-to-hear pronunciation (TTS integration)

### 2. Vocabulary Mining

When you listen to a song, LyricShare automatically extracts vocabulary:

- **Unique words** — Every new word in a song is logged
- **Frequency ranking** — Words ranked by how often they appear (in the song and across all songs)
- **Context preservation** — Each word is saved with its original lyric line
- **Difficulty scoring** — Words tagged as beginner, intermediate, or advanced

### 3. Spaced Repetition (SRS)

Based on the FSRS algorithm (used by Anki), words you've mined are queued for review:

```
Day 1:  Hello ────┐
                   │
Day 2:            Review Hello ──── Easy → next review in 4 days
                                    Hard → next review in 1 day
                                    Again → review again today
```

- New words start at **mastery level 0**
- Each successful review increases mastery (0 → 5)
- Higher mastery = longer intervals between reviews
- Mastery level 5 = word is "learned"

### 4. Exercise Types

Each song generates exercises automatically from its lyrics:

#### Fill in the Blank
```
"Hello from the _____ side"

Choices: [ other ] [ another ] [ different ] [ opposite ]
```

#### Translation Match
```
Match each word to its translation:

Hello       →  _______
from        →  _______
other       →  _______

Options: [ desde ] [ otro ] [ hola ] [ lado ]
```

#### Listening Dictation
```
🔊 (audio plays)

Type what you hear: ___________
```

#### Word Order
```
Arrange the words to form a correct sentence:

[ side ] [ Hello ] [ the ] [ from ] [ other ]

→ _______________________________
```

#### Multiple Choice
```
What does "Hello" mean?
  A) Goodbye
  B) Thank you
  C) Hello / Hi
  D) Please
```

### 5. Song Difficulty Rating

Every song is scored on four dimensions (1-10):

| Dimension    | What it measures                                  |
|-------------|---------------------------------------------------|
| Vocabulary  | Rarity and complexity of words used               |
| Speed       | Words per minute (WPM)                            |
| Grammar     | Sentence complexity, tenses, structures           |
| Accent      | Clarity of pronunciation, regional variations     |

A beginner song looks like: `Vocab: 2/10 · Speed: 3/10 · Grammar: 2/10 · Accent: 1/10`

### 6. Progress Tracking

Your learning dashboard shows:

- **Songs completed** — Full listens with active engagement
- **Vocabulary learned** — Words at mastery level 5
- **Exercises completed** — Total exercises attempted
- **Accuracy rate** — Percentage of correct answers
- **Streak** — Consecutive days with learning activity
- **Time spent** — Total listening + study time

## Learning Path

### Beginner

1. Pick a song in your target language with **low difficulty** rating
2. Read the translation first, then listen with lyrics on
3. Mine 5-10 new words and review them with SRS
4. Complete the "fill in the blank" exercise

### Intermediate

1. Try songs with **medium difficulty**
2. Hide translations — listen and read, infer meaning
3. Complete "listening dictation" and "translation match" exercises
4. Create a playlist of songs at your level

### Advanced

1. Challenge yourself with **high-speed** rap or complex lyrics
2. Listen without lyrics, then check your understanding
3. Contribute translations and romanizations for other learners
4. Export lyric videos to practice shadowing (speaking along)

## Database Schema (Learning)

Key tables for the learning system:

```sql
-- Words you're learning
vocabulary (user_id, word, language, translation, romanization,
            song_id, context_line, frequency, mastery_level, srs_due)

-- Generated exercises
exercises (song_id, type, question, correct_answer, options,
           difficulty, lyric_line_index)

-- Your answers
exercise_attempts (user_id, exercise_id, answer, is_correct, time_spent_ms)

-- Song progress
user_progress (user_id, song_id, progress_percent, last_position,
               completed_lines, mastery_score, times_played)
```

## API Endpoints

| Endpoint                                      | Description                |
|-----------------------------------------------|----------------------------|
| `GET /api/learning/exercises/:songId`         | Get exercises for a song   |
| `POST /api/learning/attempts`                 | Submit an exercise attempt |
| `GET /api/learning/vocabulary/:songId`        | Get vocabulary for a song  |
| `GET /api/learning/progress/:songId`          | Get user's song progress   |

## CLI-Based Demo (Quick Start)

If you want to experiment without setting up the full stack:

```bash
# Parse lyrics from a file
cd core/lyricshare-core && cargo run --example parse_lyrics -- "lyrics.lrc"

# Run vocabulary extraction tests
cargo test -- test_vocabulary
```

---

> **Tip:** Start with songs you already love in your target language. Familiar melodies make new vocabulary easier to remember.
