use serde::{Deserialize, Serialize};
use crate::types::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncEngine {
    pub lyrics: Lyrics,
    pub duration_secs: f64,
    pub time_map: Vec<TimeMapEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimeMapEntry {
    pub line_index: usize,
    pub start_time: f64,
    pub end_time: f64,
}

impl SyncEngine {
    pub fn new(lyrics: Lyrics, duration_secs: f64) -> Self {
        SyncEngine {
            lyrics,
            duration_secs,
            time_map: Vec::new(),
        }
    }

    pub fn build_time_map(&mut self) {
        self.time_map = self
            .lyrics
            .lines
            .iter()
            .enumerate()
            .map(|(i, line)| TimeMapEntry {
                line_index: i,
                start_time: line.start_time,
                end_time: line.end_time,
            })
            .collect();
    }

    pub fn get_state(&mut self, current_time: f64) -> LyricSyncState {
        if self.time_map.is_empty() {
            self.build_time_map();
        }

        let current_time = current_time.clamp(0.0, self.duration_secs);
        let overall_progress = if self.duration_secs > 0.0 {
            current_time / self.duration_secs
        } else {
            0.0
        };

        // Find current line using binary search
        let current_line_index = self
            .time_map
            .binary_search_by(|entry| {
                if current_time < entry.start_time {
                    std::cmp::Ordering::Greater
                } else if current_time > entry.end_time {
                    std::cmp::Ordering::Less
                } else {
                    std::cmp::Ordering::Equal
                }
            });

        let current_line_index = match current_line_index {
            Ok(idx) => idx as i32,
            Err(idx) if idx > 0 => (idx - 1) as i32,
            _ => 0,
        };

        let current_line_idx = current_line_index.max(0) as usize;

        // Calculate line progress and current word
        let (line_progress, current_word_index) = if current_line_idx < self.lyrics.lines.len() {
            let line = &self.lyrics.lines[current_line_idx];
            let line_duration = line.end_time - line.start_time;

            if line_duration > 0.0 {
                let elapsed_in_line = (current_time - line.start_time).clamp(0.0, line_duration);
                let progress = elapsed_in_line / line_duration;

                // Find current word
                let word_idx = line
                    .words
                    .binary_search_by(|w| {
                        if current_time < w.start_time {
                            std::cmp::Ordering::Greater
                        } else if current_time > w.end_time {
                            std::cmp::Ordering::Less
                        } else {
                            std::cmp::Ordering::Equal
                        }
                    })
                    .unwrap_or_else(|idx| {
                        if idx > 0 {
                            (idx - 1).min(line.words.len().saturating_sub(1))
                        } else {
                            0
                        }
                    });

                (progress, word_idx as i32)
            } else {
                (0.0, -1)
            }
        } else {
            (0.0, -1)
        };

        // Build visible lines (current + a few before and after)
        let visible_range = 5i32;
        let start = (current_line_idx as i32 - visible_range).max(0) as usize;
        let end = (current_line_idx as i32 + visible_range + 1)
            .min(self.lyrics.lines.len() as i32) as usize;

        let visible_lines: Vec<LyricLine> = self.lyrics.lines[start..end].to_vec();

        let current_line = self.lyrics.lines.get(current_line_idx).cloned();
        let next_line = self.lyrics.lines.get(current_line_idx + 1).cloned();
        let previous_line = if current_line_idx > 0 {
            self.lyrics.lines.get(current_line_idx - 1).cloned()
        } else {
            None
        };

        LyricSyncState {
            current_line_index: current_line_idx as i32,
            current_word_index: current_word_index as i32,
            line_progress,
            overall_progress,
            current_line,
            next_line,
            previous_line,
            visible_lines,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_test_lyrics() -> Lyrics {
        Lyrics {
            song_id: None,
            language: "en".to_string(),
            lines: vec![
                LyricLine {
                    index: 0,
                    text: "Hello world".to_string(),
                    start_time: 0.0,
                    end_time: 2.0,
                    words: vec![
                        LyricWord { word: "Hello".to_string(), start_time: 0.0, end_time: 1.0 },
                        LyricWord { word: "world".to_string(), start_time: 1.0, end_time: 2.0 },
                    ],
                    translation: None,
                    romanization: None,
                },
                LyricLine {
                    index: 1,
                    text: "How are you".to_string(),
                    start_time: 2.0,
                    end_time: 4.0,
                    words: vec![
                        LyricWord { word: "How".to_string(), start_time: 2.0, end_time: 2.7 },
                        LyricWord { word: "are".to_string(), start_time: 2.7, end_time: 3.3 },
                        LyricWord { word: "you".to_string(), start_time: 3.3, end_time: 4.0 },
                    ],
                    translation: None,
                    romanization: None,
                },
            ],
        }
    }

    #[test]
    fn test_sync_engine_time_map() {
        let mut engine = SyncEngine::new(make_test_lyrics(), 10.0);
        engine.build_time_map();
        assert_eq!(engine.time_map.len(), 2);
        assert_eq!(engine.time_map[0].start_time, 0.0);
        assert_eq!(engine.time_map[1].start_time, 2.0);
    }

    #[test]
    fn test_get_state_at_line_0_start() {
        let mut engine = SyncEngine::new(make_test_lyrics(), 10.0);
        let state = engine.get_state(0.0);
        assert_eq!(state.current_line_index, 0);
        assert_eq!(state.current_line.as_ref().unwrap().text, "Hello world");
    }

    #[test]
    fn test_get_state_at_line_1() {
        let mut engine = SyncEngine::new(make_test_lyrics(), 10.0);
        let state = engine.get_state(2.5);
        assert_eq!(state.current_line_index, 1);
        assert_eq!(state.current_line.as_ref().unwrap().text, "How are you");
    }

    #[test]
    fn test_progress_0_to_1() {
        let mut engine = SyncEngine::new(make_test_lyrics(), 10.0);
        let state = engine.get_state(5.0);
        assert!((state.overall_progress - 0.5).abs() < 0.01);
    }
}
