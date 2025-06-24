use std::env;
use hex;
use dotenvy::dotenv;

#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub jwt_salt: [u8; 16],
    pub jwt_secret: String,
    pub jwt_expiration_secs: i64,
}

impl Config {
    pub fn load_env() -> Self {
        dotenv().ok();
        
        let jwt_salt_hex = env::var("JWT_SALT_HEX").expect("JWT_SALT_HEX must be set");
        let jwt_salt = hex::decode(&jwt_salt_hex).expect("JWT_SALT_HEX must be valid hex");
        let jwt_salt: [u8; 16] = jwt_salt.try_into().expect("JWT_SALT_HEX must decode to 16 bytes");

        Self {
            database_url: env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
            jwt_salt,
            jwt_secret: env::var("JWT_SECRET").expect("JWT_SECRET must be set"),
            jwt_expiration_secs: env::var("JWT_EXPIRATION_SECS")
                .unwrap_or_else(|_| "3600".to_string())
                .parse()
                .expect("JWT_EXPIRATION_SECS must be a number"),
        }
    }
}
