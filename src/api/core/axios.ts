import axios, { AxiosError } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../../utils/tokenStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 헤더에 Accesstoken 추가
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const response = (error as AxiosError).response;

    // AccessToken 만료: reissue 시도
    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        // refreshToken으로 재발급 요청
        const reissueResponse = await axios.post(
          "/api/v1/auth/reissue",
          { refreshToken },
          { baseURL: import.meta.env.VITE_API_BASE_URL }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          reissueResponse.data.data;

        await saveTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (reissueError) {
        const reissueRes = (reissueError as AxiosError).response;

        if (reissueRes?.status === 401) {
          await clearTokens();
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/intro";
        }

        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
