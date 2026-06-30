use axum::{Json, Router, extract::State, routing::post, http::StatusCode};
use std::sync::Arc;
use uuid::Uuid;
use serde::Deserialize;
use serde_json::json;

use crate::AppState;
use crate::errors::ApiError;

#[derive(Deserialize)]
pub struct PresignedUrlRequest {
    pub file_name: String,
    pub content_type: String,
}

#[derive(Deserialize)]
pub struct ConfirmUploadRequest {
    pub file_key: String,
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/presigned", post(get_presigned_url))
        .route("/confirm", post(confirm_upload))
}

async fn get_presigned_url(
    State(state): State<Arc<AppState>>,
    Json(_req): Json<PresignedUrlRequest>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let file_key = format!("uploads/{}", Uuid::new_v4());

    // For now, return a mock presigned URL
    Ok(Json(json!({
        "success": true,
        "data": {
            "url": format!("https://{}.s3.amazonaws.com/{}", state.s3_bucket, file_key),
            "fields": {},
            "fileKey": file_key
        }
    })))
}

async fn confirm_upload(
    Json(req): Json<ConfirmUploadRequest>,
) -> Result<Json<serde_json::Value>, ApiError> {
    Ok(Json(json!({
        "success": true,
        "data": {
            "fileKey": req.file_key,
            "url": format!("/{}", req.file_key)
        }
    })))
}
