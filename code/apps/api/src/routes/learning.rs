use axum::{Json, Router, extract::{State, Path}, routing::{get, post}, http::StatusCode};
use std::sync::Arc;
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::AppState;
use crate::errors::ApiError;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Exercise {
    pub id: Uuid,
    pub song_id: Uuid,
    pub exercise_type: String,
    pub question: String,
    pub correct_answer: String,
    pub options: Option<Vec<String>>,
    pub hint: Option<String>,
    pub difficulty: i32,
    pub lyric_line_index: Option<i32>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct ExerciseAttempt {
    pub id: Uuid,
    pub user_id: Uuid,
    pub exercise_id: Uuid,
    pub answer: String,
    pub is_correct: bool,
    pub time_spent_ms: i32,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Vocabulary {
    pub id: Uuid,
    pub user_id: Uuid,
    pub word: String,
    pub language: String,
    pub translation: String,
    pub romanization: Option<String>,
    pub song_id: Uuid,
    pub context_line: String,
    pub frequency: i32,
    pub mastery_level: i32,
    pub srs_due: chrono::DateTime<chrono::Utc>,
    pub last_reviewed: Option<chrono::DateTime<chrono::Utc>>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct UserProgress {
    pub id: Uuid,
    pub user_id: Uuid,
    pub song_id: Uuid,
    pub progress_percent: f64,
    pub last_position: f64,
    pub completed_lines: i32,
    pub mastery_score: Option<f64>,
    pub times_played: i32,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Deserialize)]
pub struct SubmitAttemptRequest {
    pub exercise_id: Uuid,
    pub answer: String,
    pub time_spent_ms: i32,
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/exercises/{song_id}", get(get_exercises))
        .route("/attempts", post(submit_attempt))
        .route("/vocabulary/{song_id}", get(get_vocabulary))
        .route("/progress/{song_id}", get(get_progress))
}

async fn get_exercises(
    State(state): State<Arc<AppState>>,
    Path(song_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let exercises = sqlx::query_as::<_, Exercise>("SELECT * FROM exercises WHERE song_id = $1")
        .bind(song_id)
        .fetch_all(&state.db)
        .await?;

    Ok(Json(json!({ "success": true, "data": exercises })))
}

async fn submit_attempt(
    State(state): State<Arc<AppState>>,
    Json(req): Json<SubmitAttemptRequest>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let exercise = sqlx::query_as::<_, Exercise>("SELECT * FROM exercises WHERE id = $1")
        .bind(req.exercise_id)
        .fetch_optional(&state.db)
        .await?
        .ok_or(ApiError::NotFound)?;

    let is_correct = exercise.correct_answer.trim().to_lowercase()
        == req.answer.trim().to_lowercase();

    let id = Uuid::new_v4();
    let user_id = Uuid::nil();

    sqlx::query(
        r#"INSERT INTO exercise_attempts (id, user_id, exercise_id, answer, is_correct, time_spent_ms)
           VALUES ($1, $2, $3, $4, $5, $6)"#
    )
    .bind(id)
    .bind(user_id)
    .bind(req.exercise_id)
    .bind(&req.answer)
    .bind(is_correct)
    .bind(req.time_spent_ms)
    .execute(&state.db)
    .await?;

    Ok(Json(json!({
        "success": true,
        "data": {
            "correct": is_correct,
            "explanation": if is_correct { "Correct!".to_string() } else { format!("Correct answer: {}", exercise.correct_answer) }
        }
    })))
}

async fn get_vocabulary(
    State(state): State<Arc<AppState>>,
    Path(song_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let vocabulary = sqlx::query_as::<_, Vocabulary>("SELECT * FROM vocabulary WHERE song_id = $1 ORDER BY frequency DESC")
        .bind(song_id)
        .fetch_all(&state.db)
        .await?;

    Ok(Json(json!({ "success": true, "data": vocabulary })))
}

async fn get_progress(
    State(state): State<Arc<AppState>>,
    Path(song_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let user_id = Uuid::nil();

    let progress = sqlx::query_as::<_, UserProgress>(
        r#"SELECT * FROM user_progress WHERE user_id = $1 AND song_id = $2"#
    )
    .bind(user_id)
    .bind(song_id)
    .fetch_optional(&state.db)
    .await?;

    Ok(Json(json!({ "success": true, "data": progress })))
}
