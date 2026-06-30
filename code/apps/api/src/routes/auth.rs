use axum::{Json, Router, extract::State, routing::post, http::StatusCode};
use std::sync::Arc;
use uuid::Uuid;
use chrono::Utc;
use jsonwebtoken::{encode, EncodingKey, Header};
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::SaltString;
use rand_core::OsRng;
use serde::{Deserialize, Serialize};

use crate::AppState;
use crate::config::JWT_EXPIRATION;
use crate::errors::ApiError;

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub email: String,
    pub password: String,
    pub native_language: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct UserPublic {
    pub id: Uuid,
    pub username: String,
    pub display_name: String,
    pub avatar_url: Option<String>,
    pub bio: Option<String>,
    pub native_language: String,
    pub learning_languages: Vec<String>,
    pub role: String,
    pub created_at: chrono::DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserPublic,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
    pub iat: usize,
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
}

async fn register(
    State(state): State<Arc<AppState>>,
    Json(req): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, ApiError> {
    let password_hash = Argon2::default()
        .hash_password(req.password.as_bytes(), &SaltString::generate(&mut OsRng))
        .map_err(|e| ApiError::Internal(e.to_string()))?
        .to_string();

    let user_id = Uuid::new_v4();
    let now = Utc::now();

    sqlx::query(
        r#"INSERT INTO users (id, username, display_name, email, password_hash, native_language, learning_languages, role, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"#
    )
    .bind(user_id)
    .bind(&req.username)
    .bind(&req.username)
    .bind(&req.email)
    .bind(&password_hash)
    .bind(&req.native_language)
    .bind(&vec!["en".to_string()])
    .bind("user")
    .bind(now)
    .bind(now)
    .execute(&state.db)
    .await
    .map_err(|e| {
        if e.to_string().contains("duplicate") {
            ApiError::Conflict("Username or email already exists".to_string())
        } else {
            ApiError::Internal(e.to_string())
        }
    })?;

    let token = encode(
        &Header::default(),
        &Claims {
            sub: user_id.to_string(),
            exp: (now + *JWT_EXPIRATION).timestamp() as usize,
            iat: now.timestamp() as usize,
        },
        &EncodingKey::from_secret(state.jwt_secret.as_bytes()),
    )
    .map_err(|e| ApiError::Internal(e.to_string()))?;

    Ok(Json(AuthResponse {
        token,
        user: UserPublic {
            id: user_id,
            username: req.username,
            display_name: req.username,
            avatar_url: None,
            bio: None,
            native_language: req.native_language,
            learning_languages: vec!["en".to_string()],
            role: "user".to_string(),
            created_at: now,
        },
    }))
}

async fn login(
    State(state): State<Arc<AppState>>,
    Json(req): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, ApiError> {
    let user = sqlx::query_as::<_, (Uuid, String, String, String, String, Option<String>, Option<String>, String, Vec<String>, String, chrono::DateTime<Utc>)>(
        r#"SELECT id, username, display_name, email, password_hash, avatar_url, bio, native_language, learning_languages, role, created_at
           FROM users WHERE email = $1"#
    )
    .bind(&req.email)
    .fetch_optional(&state.db)
    .await?
    .ok_or(ApiError::Unauthorized)?;

    let parsed_hash = PasswordHash::new(&user.4)
        .map_err(|e| ApiError::Internal(e.to_string()))?;

    Argon2::default()
        .verify_password(req.password.as_bytes(), &parsed_hash)
        .map_err(|_| ApiError::Unauthorized)?;

    let now = Utc::now();
    let token = encode(
        &Header::default(),
        &Claims {
            sub: user.0.to_string(),
            exp: (now + *JWT_EXPIRATION).timestamp() as usize,
            iat: now.timestamp() as usize,
        },
        &EncodingKey::from_secret(state.jwt_secret.as_bytes()),
    )
    .map_err(|e| ApiError::Internal(e.to_string()))?;

    Ok(Json(AuthResponse {
        token,
        user: UserPublic {
            id: user.0,
            username: user.1,
            display_name: user.2,
            avatar_url: user.5,
            bio: user.6,
            native_language: user.7,
            learning_languages: user.8,
            role: user.9,
            created_at: user.10,
        },
    }))
}
