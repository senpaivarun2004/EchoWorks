use serde::{Deserialize, Serialize};
use crate::types::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RenderFrame {
    pub state: LyricSyncState,
    pub dimensions: FrameDimensions,
    pub style: FrameStyle,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FrameDimensions {
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FrameStyle {
    pub show_translation: bool,
    pub show_romanization: bool,
}

impl FrameData {
    pub fn to_render_frame(&self) -> RenderFrame {
        RenderFrame {
            state: self.state.clone(),
            dimensions: FrameDimensions {
                width: self.width,
                height: self.height,
            },
            style: FrameStyle {
                show_translation: self.show_translation,
                show_romanization: self.show_romanization,
            },
        }
    }
}
