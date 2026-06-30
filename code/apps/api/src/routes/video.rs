use axum::{Json, Router, extract::{State, Path}, routing::{get, post}, http::StatusCode};
use std::sync::Arc;
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::AppState;
use crate::errors::ApiError;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct VideoExportJob {
    pub id: Uuid,
    pub user_id: Uuid,
    pub song_id: Uuid,
    pub status: String,
    pub settings: serde_json::Value,
    pub output_url: Option<String>,
    pub progress: f64,
    pub error: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub completed_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateVideoExportRequest {
    pub song_id: Uuid,
    pub settings: serde_json::Value,
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/export", post(create_video_export))
        .route("/export/{job_id}", get(get_video_export_status))
}

async fn create_video_export(
    State(state): State<Arc<AppState>>,
    Json(req): Json<CreateVideoExportRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), ApiError> {
    let id = Uuid::new_v4();
    let user_id = Uuid::nil();

    sqlx::query(
        r#"INSERT INTO video_export_jobs (id, user_id, song_id, status, settings, progress)
           VALUES ($1, $2, $3, $4, $5, $6)"#
    )
    .bind(id)
    .bind(user_id)
    .bind(req.song_id)
    .bind("pending")
    .bind(&req.settings)
    .bind(0.0)
    .execute(&state.db)
    .await?;

    let job = sqlx::query_as::<_, VideoExportJob>("SELECT * FROM video_export_jobs WHERE id = $1")
        .bind(id)
        .fetch_one(&state.db)
        .await?;

    Ok((StatusCode::CREATED, Json(json!({ "success": true, "data": job }))))
}

async fn get_video_export_status(
    State(state): State<Arc<AppState>>,
    Path(job_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let job = sqlx::query_as::<_, VideoExportJob>("SELECT * FROM video_export_jobs WHERE id = $1")
        .bind(job_id)
        .fetch_optional(&state.db)
        .await?
        .ok_or(ApiError::NotFound)?;

    Ok(Json(json!({ "success": true, "data": job })))
}
