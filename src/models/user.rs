use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use anyhow;

#[derive(Debug, Serialize, Deserialize, ToSchema, Clone, FromRow)]
pub struct User {
    pub id: i32, // Changed to i32 to match SERIAL type in Postgres
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    #[serde(skip)] // Don't send password hash in responses
    pub password: String,
    #[sqlx(try_from = "String")]
    pub role: Role,
}

#[derive(Debug, Serialize, Deserialize, ToSchema, Clone, PartialEq)]
pub enum Role {
    Admin,
    User,
}

impl TryFrom<String> for Role {
    type Error = anyhow::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "admin" => Ok(Role::Admin),
            "user" => Ok(Role::User),
            _ => Err(anyhow::anyhow!("Invalid role")),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, ToSchema, Deserialize)]
pub struct LoginResponse {
    pub token: String,
}

#[derive(Debug, Serialize, ToSchema, Deserialize)]
pub struct RegisterRequest {
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, ToSchema, Deserialize)]
pub struct RegisterResponse {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
}