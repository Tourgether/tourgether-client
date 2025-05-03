// src/api/auth/socialLoginApi.ts
import axios from "axios";

export async function socialLogin(provider: string, accessToken: string) {
  const response = await axios.post(
    `/api/v1/oauth2/${provider}/login`,
    {
      socialAccessToken: accessToken,
    },
    {
      baseURL: import.meta.env.VITE_API_BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}
