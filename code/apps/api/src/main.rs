use axum::{Router, routing::get};
use tower_http::cors::{CorsLayer, Any};
use tower_http::trace::TraceLayer;
use std::sync::Arc;
use tracing_subscriber::EnvFilter;

mod config;
mod middleware;
mod routes;
mod errors;

pub struct AppState {
    pub db: sqlx::PgPool,
    pub s3_client: aws_sdk_s3::Client,
    pub jwt_secret: String,
    pub s3_bucket: String,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    dotenvy::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    let jwt_secret = std::env::var("JWT_SECRET")
        .unwrap_or_else(|_| "lyricshare-dev-secret".to_string());
    let s3_endpoint = std::env::var("S3_ENDPOINT").ok();
    let s3_bucket = std::env::var("S3_BUCKET")
        .unwrap_or_else(|_| "lyricshare".to_string());

    let db = sqlx::PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to database");

    let s3_config = aws_config::from_env()
        .endpoint_url(s3_endpoint.unwrap_or_default())
        .load()
        .await;

    let s3_client = aws_sdk_s3::Client::new(&s3_config);

    let state = Arc::new(AppState {
        db,
        s3_client,
        jwt_secret,
        s3_bucket,
    });

    let app = Router::new()
        .route("/api/health", get(|| async { "OK" }))
        .nest("/api/auth", routes::auth::router())
        .nest("/api/songs", routes::songs::router())
        .nest("/api/playlists", routes::playlists::router())
        .nest("/api/upload", routes::upload::router())
        .nest("/api/learning", routes::learning::router())
        .nest("/api/video", routes::video::router())
        .nest("/api/users", routes::users::router())
        .nest("/api/search", routes::search::router())
        .layer(TraceLayer::new_for_http())
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any)
        )
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await
        .unwrap();

    tracing::info!("LyricShare API listening on port 3001");
    axum::serve(listener, app).await.unwrap();
}
