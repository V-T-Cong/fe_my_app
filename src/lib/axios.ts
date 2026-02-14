import axios from "axios";

// All API calls go through the Next.js proxy which handles auth cookies server-side
const axiosClient = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// No need for request interceptors — cookies are sent automatically
// No need for response interceptors — the proxy handles token refresh

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If proxy returns 401, session is truly expired
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;