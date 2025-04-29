// src/hooks/useSocialLogin.ts
import { useNavigate } from "react-router-dom";
import { socialLogin } from "../api/auth/socialLogin";
import { saveTokens } from "../utils/tokenStorage";

export function useSocialLogin() {
  const navigate = useNavigate();

  async function handleSocialLogin(
    provider: "kakao" | "naver" | "google",
    getAccessToken: () => Promise<string>
  ) {
    try {
      const socialAccessToken = await getAccessToken();
      const response = await socialLogin(provider, socialAccessToken);

      const { accessToken: accessToken, refreshToken } = response.data;
      console.log("accessToken:", accessToken, "refreshToken:", refreshToken);

      await saveTokens(accessToken, refreshToken);
      navigate("/home");
    } catch (error) {
      console.error(`${provider} 로그인 실패`, error);
    }
  }

  return { handleSocialLogin };
}
