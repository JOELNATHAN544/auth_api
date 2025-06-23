use dotenvy::dotenv;
use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64};

#[derive(Debug, Clone)]
pub struct Config {
    pub jwt_salt: [u8; 16],
    pub jwt_secret: String,
    pub jwt_expiration_secs: u32,
} 

pub fn load_env() -> Config {
    dotenv().ok();

    let jwt_salt = std::env::var("JWT_SALT").expect("JWT_SALT environment variable is not set");
    
    // Decode base64-encoded salt
    let jwt_salt_bytes = BASE64.decode(jwt_salt.as_bytes())
        .expect("JWT_SALT must be a valid base64-encoded string");
    
    if jwt_salt_bytes.len() != 16 {
        panic!("JWT_SALT must decode to exactly 16 bytes");
    }
    
    let mut jwt_salt = [0u8; 16];
    jwt_salt.copy_from_slice(&jwt_salt_bytes[..16]);
    
    let jwt_secret = std::env
        ::var("JWT_SECRET")
        .expect("JWT_SECRET environment variable is not set");

    let jwt_expiration_secs = std::env
        ::var("JWT_EXPIRATION")
        .expect("JWT_EXPIRATION environment variable is not set")
        .parse::<u32>()
        .expect("JWT_EXPIRATION must be a valid integer");

    return Config {
        jwt_salt,
        jwt_secret,
        jwt_expiration_secs,
    };
}
