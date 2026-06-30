use axum::{Json, Router, extract::{State, Path}, routing::{get, post, delete}, http::StatusCode};
use std::sync::Arc;
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::AppState;
use crate::errors::ApiError;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Playlist {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub cover_url: Option<String>,
    pub user_id: Uuid,
    pub songs: Vec<Uuid>,
    pub is_public: bool,
    pub is_collaborative: bool,
    pub collaborators: Vec<Uuid>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreatePlaylistRequest {
    pub name: String,
    pub description: Option<String>,
    pub cover_url: Option<String>,
    pub songs: Option<Vec<Uuid>>,
    pub is_public: Option<bool>,
    pub is_collaborative: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct AddSongRequest {
    pub song_id: Uuid,
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/", get(list_playlists))
        .route("/", post(create_playlist))
        .route("/{id}", get(get_playlist))
        .route("/{id}", delete(delete_playlist))
        .route("/{id}/songs", post(add_song))
        .route("/{id}/songs/{song_id}", delete(remove_song))
}

async fn list_playlists(
    State(state): State<Arc<AppState>>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let playlists = sqlx::query_as::<_, Playlist>("SELECT * FROM playlists WHERE is_public = true ORDER BY created_at DESC")
        .fetch_all(&state.db)
        .await?;

    Ok(Json(json!({ "success": true, "data": playlists })))
}

async fn get_playlist(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let playlist = sqlx::query_as::<_, Playlist>("SELECT * FROM playlists WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or(ApiError::NotFound)?;

    Ok(Json(json!({ "success": true, "data": playlist })))
}

async fn create_playlist(
    State(state): State<Arc<AppState>>,
    Json(req): Json<CreatePlaylistRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), ApiError> {
    let id = Uuid::new_v4();
    let user_id = Uuid::nil();

    sqlx::query(
        r#"INSERT INTO playlists (id, name, description, cover_url, user_id, songs, is_public, is_collaborative, collaborators)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)"#
    )
    .bind(id)
    .bind(&req.name)
    .bind(&req.description)
    .bind(&req.cover_url)
    .bind(user_id)
    .bind(&req.songs.unwrap_or_default())
    .bind(req.is_public.unwrap_or(true))
    .bind(req.is_collaborative.unwrap_or(false))
    .bind(&Vec::<Uuid>::new())
    .execute(&state.db)
    .await?;

    let playlist = sqlx::query_as::<_, Playlist>("SELECT * FROM playlists WHERE id = $1")
        .bind(id)
        .fetch_one(&state.db)
        .await?;

    Ok((StatusCode::CREATED, Json(json!({ "success": true, "data": playlist }))))
}

async fn delete_playlist(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    sqlx::query("DELETE FROM playlists WHERE id = $1")
        .bind(id)
        .execute(&state.db)
        .await?;

    Ok(Json(json!({ "success": true, "data": { "deleted": true } })))
}

async fn add_song(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
    Json(req): Json<AddSongRequest>,
) -> Result<Json<serde_json::Value>, ApiError> {
    sqlx::query(
        r#"UPDATE playlists SET songs = array_append(songs, $1), updated_at = NOW() WHERE id = $2"#
    )
    .bind(req.song_id)
    .bind(id)
    .execute(&state.db)
    .await?;

    let playlist = sqlx::query_as::<_, Playlist>("SELECT * FROM playlists WHERE id = $1")
        .bind(id)
        .fetch_one(&state.db)
        .await?;

    Ok(Json(json!({ "success": true, "data": playlist })))
}

async fn remove_song(
    State(state): State<Arc<AppState>>,
    Path((id, song_id)): Path<(Uuid, Uuid)>,
) -> Result<Json<serde_json::Value>, ApiError> {
    sqlx::query(
        r#"UPDATE playlists SET songs = array_remove(songs, $1), updated_at = NOW() WHERE id = $2"#
    )
    .bind(song_id)
    .bind(id)
    .execute(&state.db)
    .await?;

    let playlist = sqlx::query_as::<_, Playlist>("SELECT * FROM playlists WHERE id = $1")
        .bind(id)
        .fetch_one(&state.db)
        .await?;

    Ok(Json(json!({ "success": true, "data": playlist })))
}
