# API Services

Centralized API layer với Axios interceptors.

## 📁 Structure

```
services/api/
├── client.ts              # Axios instances
├── interceptors.ts        # Request/Response middleware
└── endpoints/            # API endpoint functions
    ├── auth.service.ts
    ├── user.service.ts
    └── livestream.service.ts
```

## 🚀 Usage

### Basic API Call

```typescript
import apiClient from '@/services/api/client';

// GET request
const response = await apiClient.get('/users/profile');

// POST request
const response = await apiClient.post('/auth/login', {
    email: 'user@example.com',
    password: 'password123'
});
```

### Using Service Functions

```typescript
import { authService } from '@/services/api/endpoints/auth.service';

const user = await authService.login(email, password);
```

## 🔧 Features

### 1. Auto Token Management
- Tự động thêm `Authorization` header
- Auto refresh token khi 401
- Auto logout khi refresh failed

### 2. Request Interceptor
- Add auth token
- Add device info headers
- Log requests (dev mode)

### 3. Response Interceptor
- Handle errors centrally
- Transform response data
- Log responses (dev mode)

### 4. Error Handling
- **401**: Auto refresh token
- **403**: Show permission error
- **404**: Resource not found
- **500**: Server error
- **Network Error**: No internet
- **Timeout**: Request timeout

## 📝 Example Service

```typescript
// services/api/endpoints/user.service.ts
import apiClient from '../client';

export const userService = {
    getProfile: async () => {
        const response = await apiClient.get('/users/me');
        return response.data;
    },

    updateProfile: async (data: UpdateProfileDto) => {
        const response = await apiClient.put('/users/me', data);
        return response.data;
    },
};
```

## ⚙️ Configuration

### Update Base URL

Edit `services/api/client.ts`:

```typescript
const BASE_URL = __DEV__ 
    ? 'http://YOUR_LOCAL_IP:3000/api'
    : process.env.EXPO_PUBLIC_API_URL;
```

### Update Interceptor Logic

Edit `services/api/interceptors.ts` to customize:
- Request headers
- Response transformation
- Error handling logic
