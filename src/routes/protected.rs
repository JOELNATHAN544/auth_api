use axum::{
    extract::{Extension, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::json;
use std::sync::Arc;
use utoipa::OpenApi;
use crate::{models::{Role, User}, AppState};

#[derive(OpenApi)]
#[openapi(
    paths(admin_route, me_route),
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
pub async fn me_route(
    State(state): State<AppState>,
    Extension(user): Extension<Arc<User>>,
) -> impl IntoResponse {
    // Fetch the user from the database using the email from the JWT
    let db_user = sqlx::query_as::<_, User>(
        "SELECT id, email, first_name, last_name, password, role FROM users WHERE email = $1"
    )
    .bind(&user.email)
    .fetch_one(&state.db)
    .await;

    match db_user {
        Ok(full_user) => (StatusCode::OK, Json(full_user)).into_response(),
        Err(_) => (StatusCode::NOT_FOUND, Json(json!({"error": "User not found"}))).into_response(),
    }
}
