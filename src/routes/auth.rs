use axum::extract::State;
use axum::{http::StatusCode, response::IntoResponse, Json};
use bcrypt::hash_with_salt;
use jsonwebtoken::{encode, EncodingKey, Header};
use serde_json::json;
use utoipa::OpenApi;

use crate::middleware::auth::Claims;
use crate::models::{LoginRequest, LoginResponse, Role, User};
use crate::models::user::{RegisterRequest, RegisterResponse};
use crate::AppState;

const JWT_SALT: &[u8; 16] = b"your-salt-valuee"; // Use a secure key in production

#[derive(OpenApi)]
#[openapi(paths(login), components(schemas(LoginRequest, LoginResponse)))]
pub struct AuthApi;

#[utoipa::path(
    post, 
    path = "/login",
    request_body = LoginRequest,
    responses(
        (status = 200, description = "Login successful", body = LoginResponse),
        (status = 401, description = "Invalid credentials")
    )
)]
pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    let users = state.users.lock().unwrap();

    // Check if the user exists and the password matches
    let user = users.iter().find(|u| u.email == payload.email);
    if user.is_none()
        || bcrypt::verify(payload.password.as_bytes(), &user.unwrap().password).ok() != Some(true)
    {
        return (
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Invalid credentials"})),
        )
            .into_response();
    }

    let claims = Claims {
        sub: user.unwrap().email.clone(),
        role: user.unwrap().role.clone(),
        exp: (chrono::Utc::now() + chrono::Duration::hours(24)).timestamp() as usize,
    };
    let config = state.config.clone();
    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.jwt_secret.as_bytes()),
    )
    .unwrap();

    return (StatusCode::OK, Json(LoginResponse { token })).into_response();
}

#[utoipa::path(
    post,
    path = "/register",
    request_body = RegisterRequest,
    responses(
        (status = 201, description = "User registered successfully", body = RegisterResponse),
        (status = 400, description = "Bad request")
    )
)]
pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> impl IntoResponse {
    // In production, save to a database
    if payload.email.is_empty() || payload.password.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error": "Email and password are required"})),
        )
            .into_response();
    }
    let config = state.config.clone();
    let hashed_password = hash_with_salt(
        payload.password.as_bytes(),
        bcrypt::DEFAULT_COST,
        config.jwt_salt,
    )
    .unwrap();

    let mut users = state.users.lock().unwrap();

    let new_user = User {
        id: (users.len() as u32) + 1, // Simple ID generation
        password: hashed_password.to_string(),
        first_name: payload.first_name.clone(),
        last_name: payload.last_name.clone(),
        email: payload.email.clone(),
        role: Role::User,
    };

    users.push(new_user.clone());

    (
        StatusCode::CREATED,
        Json(RegisterResponse {
            id: new_user.id,
            first_name: new_user.first_name,
            last_name: new_user.last_name,
            email: new_user.email,
            password: new_user.password,
        }),
    )
        .into_response()
}
