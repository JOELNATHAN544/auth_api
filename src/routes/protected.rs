use axum::{
    extract::Extension,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::json;
use std::sync::Arc;
use utoipa::OpenApi;

use crate::models::{Role, User};

#[derive(OpenApi)]
#[openapi(
    paths(admin_route),
    components(schemas(User))
)]
pub struct ProtectedApi;

#[utoipa::path(
    get,
    path = "/admin",
    responses(
        (status = 200, description = "Admin access granted", body = User),
        (status = 403, description = "Forbidden")
    ),
    security(("api_key" = []))
)]
pub async fn admin_route(Extension(user): Extension<Arc<User>>) -> impl IntoResponse {
    if user.role == Role::Admin {
        (StatusCode::OK, Json(user)).into_response()
    } else {
        (
            StatusCode::FORBIDDEN,
            Json(json!({"error": "Admin access required"})),
        ).into_response()
    }
}

#[utoipa::path(
    get,
    path = "/me",
    responses(
        (status = 200, description = "User profile", body = User),
        (status = 401, description = "Unauthorized")
    ),
    security(("api_key" = []))
)]
pub async fn me_route(Extension(user): Extension<Arc<User>>) -> impl IntoResponse {
    (StatusCode::OK, Json(user)).into_response()
}
