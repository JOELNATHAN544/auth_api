use axum::{routing::get, Router};
use sqlx::PgPool;
use std::sync::Arc;
use tower_http::cors::{CorsLayer, Any};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;
use axum::routing::post;
use axum::http::header;


pub mod middleware;
pub mod models;
pub mod routes;
pub mod utils;

use crate::{middleware::auth::auth_middleware, routes::{auth, protected}, utils::Config};

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub config: Arc<Config>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    #[derive(OpenApi)]
    #[openapi(
        info(title = "Auth API", description = "A simple auth API"),
        paths(auth::login, auth::register, protected::admin_route, protected::me_route),
        components(schemas(models::User, models::Role, models::LoginRequest, models::LoginResponse))
    )]
    struct ApiDoc;

    let config = Arc::new(Config::load_env());
    println!("Using DATABASE_URL: {}", config.database_url);
    let pool = PgPool::connect(&config.database_url).await?;

    let state = AppState {
        db: pool,
        config,
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE]);

    let app = Router::new()
        .route("/admin", get(protected::admin_route))
        .route("/me", get(protected::me_route))
        .layer(axum::middleware::from_fn_with_state(state.clone(), auth_middleware))
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .route("/login", post(auth::login))
        .route("/register", post(auth::register))
        .layer(cors)
        .with_state(state);

    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}
