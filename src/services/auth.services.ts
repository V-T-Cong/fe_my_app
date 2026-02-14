import api from "@/lib/axios";

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

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  roles: string[];
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>("/api/auth/login", data);
    return response.data;
  },

  signup: async (data: SignUpRequest) => {
    const response = await api.post<string>("/api/auth/signup", data);
    return response.data;
  },

  logout: async (refreshToken: string) => {
    const response = await api.post<string>("/api/auth/logout", { refreshToken });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post("/api/auth/refresh-token", { refreshToken });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post<string>("/api/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await api.post<string>("/api/auth/reset-password", data);
    return response.data;
  },

  getMyInfo: async () => {
    const response = await api.get<UserResponse>("/api/users/my-info");
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest) => {
    const response = await api.post("/api/users/change-password", null, {
      params: data,
    });
    return response.data;
  },
};