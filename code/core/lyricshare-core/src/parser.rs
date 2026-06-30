use crate::types::*;

pub struct LrcParser;

impl LrcParser {
    pub fn parse(input: &str) -> Result<Lyrics, String> {
        let mut lines = Vec::new();
        let mut word_patterns: Vec<LyricWord> = Vec::new();

        for line in input.lines() {
            let line = line.trim();
            if line.is_empty() {
                continue;
            }

            // Handle metadata tags like [ti:Title], [ar:Artist]
            if let Some(tag) = Self::parse_metadata(line) {
                if tag.key == "language" || tag.key == "la" {
                    // Set language later
                }
                continue;
            }

            // Parse timestamped line: [mm:ss.xx]Lyric text
            if let Some((timestamps, text)) = Self::parse_timestamped_line(line) {
                if text.trim().is_empty() {
                    continue;
                }

                let start_time = timestamps[0];
                let end_time = timestamps.get(1).copied().unwrap_or(start_time + 2.0);

                let words = if !word_patterns.is_empty() {
                    word_patterns.clone()
                } else {
                    Self::split_into_words(&text, start_time, end_time)
                };

                lines.push(LyricLine {
                    index: lines.len() as u32,
                    text: text.trim().to_string(),
                    start_time,
                    end_time,
                    words,
                    translation: None,
                    romanization: None,
                });
            }
        }

        if lines.is_empty() {
            return Err("No lyric lines found in LRC content".to_string());
        }

        // Fix end times: each line ends when the next starts
        for i in 0..lines.len() - 1 {
            lines[i].end_time = lines[i + 1].start_time;
        }

        // Assign word-level timestamps if not present
        for line in &mut lines {
            if line.words.is_empty() {
                line.words = Self::split_into_words(&line.text, line.start_time, line.end_time);
            } else {
                // Distribute word timestamps evenly within the line
                let word_count = line.words.len() as f64;
                let duration = line.end_time - line.start_time;
                let word_duration = duration / word_count;
                for (j, word) in line.words.iter_mut().enumerate() {
                    word.start_time = line.start_time + (j as f64) * word_duration;
                    word.end_time = line.start_time + ((j + 1) as f64) * word_duration;
                }
            }
        }

        Ok(Lyrics {
            lines,
            language: "unknown".to_string(),
            song_id: None,
        })
    }

    fn parse_metadata(line: &str) -> Option<MetadataTag> {
        let line = line.trim();
        if !line.starts_with('[') || !line.contains(':') {
            return None;
        }
        let inner = &line[1..line.len().saturating_sub(1)];
        let colon_pos = inner.find(':')?;
        Some(MetadataTag {
            key: inner[..colon_pos].trim().to_lowercase(),
            value: inner[colon_pos + 1..].trim().to_string(),
        })
    }

    fn parse_timestamped_line(line: &str) -> Option<(Vec<f64>, String)> {
        let line = line.trim();
        if !line.starts_with('[') {
            return None;
        }

        let mut timestamps = Vec::new();
        let mut remaining = line;

        loop {
            if !remaining.starts_with('[') {
                break;
            }
            let close_bracket = remaining.find(']')?;
            let ts_str = &remaining[1..close_bracket];
            let ts = Self::parse_timestamp(ts_str)?;
            timestamps.push(ts);
            remaining = remaining[close_bracket + 1..].trim();
        }

        if timestamps.is_empty() || remaining.is_empty() {
            return None;
        }

        timestamps.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));

        Some((timestamps, remaining.to_string()))
    }

    fn parse_timestamp(ts: &str) -> Option<f64> {
        // mm:ss.xx or mm:ss.xxx
        let parts: Vec<&str> = ts.split(':').collect();
        if parts.len() != 2 {
            return None;
        }
        let minutes: f64 = parts[0].parse().ok()?;
        let seconds: f64 = parts[1].parse().ok()?;
        Some(minutes * 60.0 + seconds)
    }

    fn split_into_words(text: &str, start: f64, end: f64) -> Vec<LyricWord> {
        let words: Vec<&str> = text.split_whitespace().collect();
        if words.is_empty() {
            return Vec::new();
        }
        let duration = end - start;
        let per_word = duration / words.len() as f64;

        words
            .into_iter()
            .enumerate()
            .map(|(i, w)| LyricWord {
                word: w.to_string(),
                start_time: start + (i as f64) * per_word,
                end_time: start + ((i + 1) as f64) * per_word,
            })
            .collect()
    }
}

struct MetadataTag {
    key: String,
    value: String,
}

pub struct SrtParser;

impl SrtParser {
    pub fn parse(input: &str) -> Result<Lyrics, String> {
        let mut lines = Vec::new();

        // SRT format:
        // 1
        // 00:00:12,345 --> 00:00:14,567
        // Text here

        let blocks: Vec<&str> = input.split("\n\n").collect();

        for block in &blocks {
            let block = block.trim();
            if block.is_empty() {
                continue;
            }

            let block_lines: Vec<&str> = block.split('\n').collect();
            if block_lines.len() < 3 {
                continue;
            }

            // Parse timestamp line
            let time_line = block_lines[1].trim();
            let parts: Vec<&str> = time_line.split(" --> ").collect();
            if parts.len() != 2 {
                continue;
            }

            let start = Self::parse_srt_timestamp(parts[0])?;
            let end = Self::parse_srt_timestamp(parts[1])?;

            let text = block_lines[2..].join("\n").trim().to_string();
            if text.is_empty() {
                continue;
            }

            let words = LrcParser::split_into_words(&text, start, end);

            lines.push(LyricLine {
                index: lines.len() as u32,
                text,
                start_time: start,
                end_time: end,
                words,
                translation: None,
                romanization: None,
            });
        }

        if lines.is_empty() {
            return Err("No SRT blocks found".to_string());
        }

        Ok(Lyrics {
            lines,
            language: "unknown".to_string(),
            song_id: None,
        })
    }

    fn parse_srt_timestamp(ts: &str) -> Option<f64> {
        let ts = ts.trim().replace(',', ".");
        let parts: Vec<&str> = ts.split(':').collect();
        if parts.len() != 3 {
            return None;
        }
        let hours: f64 = parts[0].parse().ok()?;
        let minutes: f64 = parts[1].parse().ok()?;
        let seconds: f64 = parts[2].parse().ok()?;
        Some(hours * 3600.0 + minutes * 60.0 + seconds)
    }
}

pub fn parse_lrc(input: &str) -> Result<Lyrics, String> {
    LrcParser::parse(input)
}

pub fn parse_srt(input: &str) -> Result<Lyrics, String> {
    SrtParser::parse(input)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_lrc_simple() {
        let input = "[00:12.00]Hello world
[00:14.00]How are you today
[00:16.00]I am fine thank you";

        let result = parse_lrc(input).unwrap();
        assert_eq!(result.lines.len(), 3);
        assert_eq!(result.lines[0].text, "Hello world");
        assert_eq!(result.lines[1].text, "How are you today");
    }

    #[test]
    fn test_parse_lrc_with_word_timestamps() {
        let input = "[00:01.00]Line one
[00:02.00]Line two";

        let result = parse_lrc(input).unwrap();
        assert!(result.lines[0].words.len() > 0);
        assert_eq!(result.lines[0].words[0].word, "Line");
    }

    #[test]
    fn test_parse_srt() {
        let input = "1
00:00:12,000 --> 00:00:14,500
Hello world

2
00:00:15,000 --> 00:00:17,000
How are you";

        let result = parse_srt(input).unwrap();
        assert_eq!(result.lines.len(), 2);
        assert_eq!(result.lines[0].text, "Hello world");
    }

    #[test]
    fn test_empty_input() {
        assert!(parse_lrc("").is_err());
        assert!(parse_srt("").is_err());
    }
}
