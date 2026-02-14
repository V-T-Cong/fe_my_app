export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  type: string;
  accessToken: string;
  refreshToken: string;
  email: string;
}

export interface SignUpRequest {
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmationPassword: string;
}

export interface ForgetPassword {
  email: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  roles: string[];
}
