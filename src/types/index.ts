export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface AuthResponse {
  user: User | null;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}