use axum::{Json, Router, extract::{State, Query}, routing::get};
use std::sync::Arc;
use serde::Deserialize;
use serde_json::json;

use crate::AppState;
use crate::errors::ApiError;

#[derive(Deserialize)]
pub struct SearchQuery {
    pub q: String,
    pub r#type: Option<String>,
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/", get(search_all))
}

async fn search_all(
    State(state): State<Arc<AppState>>,
    Query(query): Query<SearchQuery>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let search_term = format!("%{}%", query.q);

    let songs = sqlx::query_as::<_, crate::routes::songs::Song>(
        r#"SELECT * FROM songs WHERE title ILIKE $1 OR artist ILIKE $1 LIMIT 10"#
    )
    .bind(&search_term)
    .fetch_all(&state.db)
    .await?;

    let playlists = sqlx::query_as::<_, crate::routes::playlists::Playlist>(
        r#"SELECT * FROM playlists WHERE name ILIKE $1 AND is_public = true LIMIT 5"#
    )
    .bind(&search_term)
    .fetch_all(&state.db)
    .await?;

    Ok(Json(json!({
        "success": true,
        "data": {
            "songs": songs,
            "playlists": playlists
        }
    })))
}
