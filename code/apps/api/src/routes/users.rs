use axum::{Json, Router, extract::{State, Path}, routing::{get, patch}};
use std::sync::Arc;
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::AppState;
use crate::errors::ApiError;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct UserPublic {
    pub id: Uuid,
    pub username: String,
    pub display_name: String,
    pub avatar_url: Option<String>,
    pub bio: Option<String>,
    pub native_language: String,
    pub learning_languages: Vec<String>,
    pub role: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateProfileRequest {
    pub display_name: Option<String>,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub native_language: Option<String>,
    pub learning_languages: Option<Vec<String>>,
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/me", get(get_profile))
        .route("/me", patch(update_profile))
        .route("/{user_id}", get(get_user_profile))
}

async fn get_profile(
    State(state): State<Arc<AppState>>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let user_id = Uuid::nil();

    let user = sqlx::query_as::<_, UserPublic>(
        r#"SELECT id, username, display_name, avatar_url, bio, native_language, learning_languages, role, created_at
           FROM users WHERE id = $1"#
    )
    .bind(user_id)
    .fetch_optional(&state.db)
    .await?
    .ok_or(ApiError::NotFound)?;

    Ok(Json(json!({ "success": true, "data": user })))
}

async fn update_profile(
    State(state): State<Arc<AppState>>,
    Json(req): Json<UpdateProfileRequest>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let user_id = Uuid::nil();

    sqlx::query(
        r#"UPDATE users SET
            display_name = COALESCE($1, display_name),
            bio = COALESCE($2, bio),
            avatar_url = COALESCE($3, avatar_url),
            native_language = COALESCE($4, native_language),
            learning_languages = COALESCE($5, learning_languages),
            updated_at = NOW()
           WHERE id = $6"#
    )
    .bind(&req.display_name)
    .bind(&req.bio)
    .bind(&req.avatar_url)
    .bind(&req.native_language)
    .bind(&req.learning_languages)
    .bind(user_id)
    .execute(&state.db)
    .await?;

    let user = sqlx::query_as::<_, UserPublic>(
        r#"SELECT id, username, display_name, avatar_url, bio, native_language, learning_languages, role, created_at
           FROM users WHERE id = $1"#
    )
    .bind(user_id)
    .fetch_one(&state.db)
    .await?;

    Ok(Json(json!({ "success": true, "data": user })))
}

async fn get_user_profile(
    State(state): State<Arc<AppState>>,
    Path(user_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let user = sqlx::query_as::<_, UserPublic>(
        r#"SELECT id, username, display_name, avatar_url, bio, native_language, learning_languages, role, created_at
           FROM users WHERE id = $1"#
    )
    .bind(user_id)
    .fetch_optional(&state.db)
    .await?
    .ok_or(ApiError::NotFound)?;

    Ok(Json(json!({ "success": true, "data": user })))
}
