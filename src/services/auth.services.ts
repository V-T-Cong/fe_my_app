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

export const authService = {

    login: async(data: LoginRequest) => {
        const response = await api.post<AuthResponse>("/auth/login", data);
        return response.data;
    }

};