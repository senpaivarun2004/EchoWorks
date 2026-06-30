use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LyricWord {
    pub word: String,
    pub start_time: f64,
    pub end_time: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LyricLine {
    pub index: u32,
    pub text: String,
    pub start_time: f64,
    pub end_time: f64,
    pub words: Vec<LyricWord>,
    #[serde(default)]
    pub translation: Option<String>,
    #[serde(default)]
    pub romanization: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Lyrics {
    pub lines: Vec<LyricLine>,
    pub language: String,
    #[serde(default)]
    pub song_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Timestamp {
    pub start: f64,
    pub end: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LyricSyncState {
    pub current_line_index: i32,
    pub current_word_index: i32,
    pub line_progress: f64,  // 0.0 to 1.0 within current line
    pub overall_progress: f64, // 0.0 to 1.0 within song
    pub current_line: Option<LyricLine>,
    pub next_line: Option<LyricLine>,
    pub previous_line: Option<LyricLine>,
    pub visible_lines: Vec<LyricLine>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FrameData {
    pub state: LyricSyncState,
    pub width: u32,
    pub height: u32,
    pub show_translation: bool,
    pub show_romanization: bool,
}
