import api from "@/lib/axios";

export interface LoginRequest{
    email: string;
    password: string;
}

export interface AuthResponse {
  type: string;
  accessToken: string;
  refreshToken: string;
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    // Assuming endpoint is /auth/forgot-password or similar
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    // Assuming endpoint is /auth/reset-password
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },
};