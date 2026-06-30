use axum::{
    extract::{Request, State},
    middleware::Next,
    response::Response,
    http::StatusCode,
    body::Body,
};
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use crate::models::user::Claims;
use crate::AppState;
use std::sync::Arc;

pub async fn require_auth(
    State(state): State<Arc<AppState>>,
    mut req: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|h| h.strip_prefix("Bearer "))
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token_data = decode::<Claims>(
        auth_header,
        &DecodingKey::from_secret(state.jwt_secret.as_bytes()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    req.extensions_mut().insert(token_data.claims);
    Ok(next.run(req).await)
}
