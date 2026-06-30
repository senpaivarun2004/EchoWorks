use once_cell::sync::Lazy;

pub static JWT_EXPIRATION: Lazy<chrono::Duration> = Lazy::new(|| {
    chrono::Duration::days(30)
});

pub const MAX_UPLOAD_SIZE: usize = 50 * 1024 * 1024; // 50MB
pub const DEFAULT_PAGE_SIZE: i64 = 20;
pub const MAX_PAGE_SIZE: i64 = 100;
