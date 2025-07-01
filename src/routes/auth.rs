use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use bcrypt::{hash_with_salt, verify};
use jsonwebtoken::{encode, Header, EncodingKey};
use serde_json::json;
use utoipa::OpenApi;
use crate::{
    middleware::auth::Claims,
    models::user::{LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User},
    AppState,
};

#[derive(OpenApi)]
#[openapi(paths(login, register), components(schemas(LoginRequest, LoginResponse, RegisterRequest)))]
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
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let user = sqlx::query_as::<_, User>(
        "SELECT id, email, first_name, last_name, password, role FROM users WHERE email = $1"
    )
    .bind(payload.email)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?
    .ok_or_else(|| {
        (
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Invalid credentials"})),
        )
    })?;

    if !verify(&payload.password, &user.password).unwrap_or(false) {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Invalid credentials"})),
        ));
    }

    let claims = Claims {
        sub: user.email.clone(),
        role: user.role,
        exp: (chrono::Utc::now() + chrono::Duration::hours(24)).timestamp() as usize,
    };
    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_bytes()),
    )
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    Ok((StatusCode::OK, Json(LoginResponse { token })))
}

#[utoipa::path(
    post,
    path = "/register",
    request_body = RegisterRequest,
    responses(
        (status = 201, description = "User registered successfully", body = RegisterResponse),
        (status = 409, description = "User with this email already exists"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    println!("[REGISTER] Attempting to register user: email={}, first_name={}, last_name={}", payload.email, payload.first_name, payload.last_name);
    let hashed_password = hash_with_salt(
        payload.password.as_bytes(),
        bcrypt::DEFAULT_COST,
        state.config.jwt_salt,
    )
    .map_err(|e| {
        println!("[REGISTER] Password hash error: {}", e);
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?
    .to_string();

    let result = sqlx::query!(
        "INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email",
        payload.first_name,
        payload.last_name,
        payload.email,
        hashed_password,
        "user" // Default role
    )
    .fetch_one(&state.db)
    .await;

    match result {
        Ok(record) => {
            println!("[REGISTER] Successfully registered user: email={}, id={}", record.email, record.id);
            let user = User {
                id: record.id,
                first_name: record.first_name.clone(),
                last_name: record.last_name.clone(),
                email: record.email.clone(),
                password: String::new(),
                role: crate::models::Role::User,
            };
            let claims = Claims {
                sub: user.email.clone(),
                role: user.role.clone(),
                exp: (chrono::Utc::now() + chrono::Duration::hours(24)).timestamp() as usize,
            };
            let token = encode(
                &Header::default(),
                &claims,
                &EncodingKey::from_secret(state.config.jwt_secret.as_bytes()),
            )
            .map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "error": e.to_string() })),
                )
            })?;
            Ok((StatusCode::CREATED, Json(json!({
                "token": token,
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "role": user.role,
                }
            }))))
        }
        Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => {
            println!("[REGISTER] Email already exists: {}", payload.email);
            Err((
                StatusCode::CONFLICT,
                Json(json!({"error": "User with this email already exists"})),
            ))
        }
        Err(e) => {
            println!("[REGISTER] Database error: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error": e.to_string()})),
            ))
        }
    }
}
