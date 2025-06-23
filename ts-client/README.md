# TypeScript Client for Auth API

This is a TypeScript client generated from the OpenAPI specification of your Rust authentication API.

## 🚀 Quick Start

### Prerequisites
- Node.js and npm installed
- The Rust auth API server running on `http://localhost:3000`

### Installation
```bash
cd ts-client
npm install
```

### Usage

The client provides three main API classes:

1. **AuthApi** - For authentication operations (login, register)
2. **ProtectedApi** - For protected routes (admin access)

### Example Usage

```typescript
import { Configuration } from './configuration';
import { AuthApi, ProtectedApi } from './api';

// Create API instances
const authApi = new AuthApi(new Configuration({
    basePath: 'http://localhost:3000',
}));

const protectedApi = new ProtectedApi(new Configuration({
    basePath: 'http://localhost:3000',
}));

// Register a new user
const registerResponse = await authApi.register({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'password123'
});

// Login and get JWT token
const loginResponse = await authApi.login({
    email: 'john@example.com',
    password: 'password123'
});

const token = loginResponse.data.token;

// Access protected route
const adminResponse = await protectedApi.adminRoute({
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

## 🔧 What Was Fixed

The original generated client had the following issues that were corrected:

1. **Incorrect field name**: The login function was using `username` instead of `email`
2. **Missing imports**: Configuration was imported from the wrong module
3. **Incomplete examples**: Added comprehensive examples for all endpoints

## 📋 Available Endpoints

### Authentication Endpoints
- `POST /register` - Register a new user
- `POST /login` - Login and get JWT token

### Protected Endpoints
- `GET /admin` - Admin-only access (requires JWT token)

## 🔐 Authentication

For protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🧪 Testing

Run the example client:
```bash
cd ts-client
node client.js  # After compiling with tsc
```

Or use the provided `client.ts` file as a reference for your own implementation.

## 📝 Generated Files

- `api.ts` - Main API classes and interfaces
- `configuration.ts` - Configuration class
- `base.ts` - Base API functionality
- `common.ts` - Common utilities
- `client.ts` - Example usage
- `index.ts` - Main exports 