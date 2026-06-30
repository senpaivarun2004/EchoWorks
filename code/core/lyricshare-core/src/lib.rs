pub mod parser;
pub mod sync;
pub mod types;
pub mod renderer;

use wasm_bindgen::prelude::*;
use crate::types::*;

#[wasm_bindgen]
pub fn parse_lyrics(input: &str, format: &str) -> String {
    let result = match format {
        "lrc" => parser::parse_lrc(input),
        "srt" => parser::parse_srt(input),
        _ => parser::parse_lrc(input),
    };

    match result {
        Ok(lyrics) => serde_json::to_string(&lyrics).unwrap_or_else(|e| {
            format!("{{\"error\": \"{}\"}}", e)
        }),
        Err(e) => format!("{{\"error\": \"{}\"}}", e),
    }
}

#[wasm_bindgen]
pub fn create_sync_engine(lyrics_json: &str, duration_secs: f64) -> String {
    let lyrics: Lyrics = match serde_json::from_str(lyrics_json) {
        Ok(l) => l,
        Err(e) => return format!("{{\"error\": \"{}\"}}", e),
    };

    let mut engine = sync::SyncEngine::new(lyrics, duration_secs);
    engine.build_time_map();

    serde_json::to_string(&engine).unwrap_or_else(|e| format!("{{\"error\": \"{}\"}}", e))
}

#[wasm_bindgen]
pub fn get_lyric_state(engine_json: &str, current_time: f64) -> String {
    let mut engine: sync::SyncEngine = match serde_json::from_str(engine_json) {
        Ok(e) => e,
        Err(e) => return format!("{{\"error\": \"{}\"}}", e),
    };

    let state = engine.get_state(current_time);

    serde_json::to_string(&state).unwrap_or_else(|e| format!("{{\"error\": \"{}\"}}", e))
}

#[wasm_bindgen]
pub fn generate_frame(
    engine_json: &str,
    current_time: f64,
    width: u32,
    height: u32,
    show_translation: bool,
    show_romanization: bool,
) -> String {
    let mut engine: sync::SyncEngine = match serde_json::from_str(engine_json) {
        Ok(e) => e,
        Err(e) => return format!("{{\"error\": \"{}\"}}", e),
    };

    let state = engine.get_state(current_time);

    let frame = renderer::FrameData {
        state,
        width,
        height,
        show_translation,
        show_romanization,
    };

    serde_json::to_string(&frame).unwrap_or_else(|e| format!("{{\"error\": \"{}\"}}", e))
}
