import api from "@/lib/axios";
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UserResponse,
} from "@/types";

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