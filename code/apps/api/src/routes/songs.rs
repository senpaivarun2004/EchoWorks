use axum::{Json, Router, extract::{State, Path, Query}, routing::{get, post, delete}, http::StatusCode, middleware};
use std::sync::Arc;
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::AppState;
use crate::errors::ApiError;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Song {
    pub id: Uuid,
    pub title: String,
    pub artist: String,
    pub album: Option<String>,
    pub duration: f64,
    pub cover_url: Option<String>,
    pub audio_url: String,
    pub language: String,
    pub source: String,
    pub source_id: Option<String>,
    pub genre: Vec<String>,
    pub release_year: Option<i32>,
    pub difficulty: Option<i32>,
    pub play_count: i64,
    pub created_by: Option<Uuid>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateSongRequest {
    pub title: String,
    pub artist: String,
    pub album: Option<String>,
    pub duration: f64,
    pub cover_url: Option<String>,
    pub audio_url: String,
    pub language: String,
    pub source: String,
    pub source_id: Option<String>,
    pub genre: Option<Vec<String>>,
    pub release_year: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct SongQuery {
    pub page: Option<i64>,
    pub limit: Option<i64>,
    pub search: Option<String>,
    pub language: Option<String>,
    pub genre: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Lyrics {
    pub id: Uuid,
    pub song_id: Uuid,
    pub format: String,
    pub content: String,
    pub language: String,
    pub is_synced: bool,
    pub synced_by_user_id: Option<Uuid>,
    pub source: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Deserialize)]
pub struct UploadLyricsRequest {
    pub content: String,
    pub format: String,
    pub language: Option<String>,
    pub source: Option<String>,
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/", get(list_songs))
        .route("/{id}", get(get_song))
        .route("/", post(create_song).layer(middleware::from_fn(crate::middleware::auth::require_auth)))
        .route("/{id}", delete(delete_song).layer(middleware::from_fn(crate::middleware::auth::require_auth)))
        .route("/{id}/lyrics", get(get_lyrics))
        .route("/{id}/lyrics", post(upload_lyrics).layer(middleware::from_fn(crate::middleware::auth::require_auth)))
}

async fn list_songs(
    State(state): State<Arc<AppState>>,
    Query(query): Query<SongQuery>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let page = query.page.unwrap_or(1).max(1);
    let limit = query.limit.unwrap_or(20).min(100).max(1);
    let offset = (page - 1) * limit;

    let songs = sqlx::query_as::<_, Song>(
        r#"SELECT * FROM songs
           WHERE ($1::text IS NULL OR title ILIKE '%' || $1 || '%' OR artist ILIKE '%' || $1 || '%')
           ORDER BY created_at DESC
           LIMIT $2 OFFSET $3"#
    )
    .bind(&query.search)
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.db)
    .await?;

    let total: i64 = sqlx::query_scalar(
        r#"SELECT COUNT(*) FROM songs
           WHERE ($1::text IS NULL OR title ILIKE '%' || $1 || '%' OR artist ILIKE '%' || $1 || '%')"#
    )
    .bind(&query.search)
    .fetch_one(&state.db)
    .await?;

    Ok(Json(json!({
        "success": true,
        "data": songs,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total as f64 / limit as f64).ceil() as i64
        }
    })))
}

async fn get_song(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let song = sqlx::query_as::<_, Song>("SELECT * FROM songs WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or(ApiError::NotFound)?;

    Ok(Json(json!({ "success": true, "data": song })))
}

async fn create_song(
    State(state): State<Arc<AppState>>,
    Json(req): Json<CreateSongRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), ApiError> {
    let id = Uuid::new_v4();

    sqlx::query(
        r#"INSERT INTO songs (id, title, artist, album, duration, cover_url, audio_url, language, source, source_id, genre, release_year)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"#
    )
    .bind(id)
    .bind(&req.title)
    .bind(&req.artist)
    .bind(&req.album)
    .bind(req.duration)
    .bind(&req.cover_url)
    .bind(&req.audio_url)
    .bind(&req.language)
    .bind(&req.source)
    .bind(&req.source_id)
    .bind(&req.genre.unwrap_or_default())
    .bind(req.release_year)
    .execute(&state.db)
    .await?;

    let song = sqlx::query_as::<_, Song>("SELECT * FROM songs WHERE id = $1")
        .bind(id)
        .fetch_one(&state.db)
        .await?;

    Ok((StatusCode::CREATED, Json(json!({ "success": true, "data": song }))))
}

async fn delete_song(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    sqlx::query("DELETE FROM songs WHERE id = $1")
        .bind(id)
        .execute(&state.db)
        .await?;

    Ok(Json(json!({ "success": true, "data": { "deleted": true } })))
}

async fn get_lyrics(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let lyrics = sqlx::query_as::<_, Lyrics>("SELECT * FROM lyrics WHERE song_id = $1 ORDER BY created_at DESC LIMIT 1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or(ApiError::NotFound)?;

    Ok(Json(json!({ "success": true, "data": lyrics })))
}

async fn upload_lyrics(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
    Json(req): Json<UploadLyricsRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), ApiError> {
    let lyrics_id = Uuid::new_v4();

    sqlx::query(
        r#"INSERT INTO lyrics (id, song_id, format, content, language, is_synced, source)
           VALUES ($1, $2, $3, $4, $5, $6, $7)"#
    )
    .bind(lyrics_id)
    .bind(id)
    .bind(&req.format)
    .bind(&req.content)
    .bind(&req.language.unwrap_or_else(|| "unknown".to_string()))
    .bind(req.format != "unsynced")
    .bind(&req.source.unwrap_or_else(|| "upload".to_string()))
    .execute(&state.db)
    .await?;

    let lyrics = sqlx::query_as::<_, Lyrics>("SELECT * FROM lyrics WHERE id = $1")
        .bind(lyrics_id)
        .fetch_one(&state.db)
        .await?;

    Ok((StatusCode::CREATED, Json(json!({ "success": true, "data": lyrics }))))
}
