import { useNavigate } from "react-router-dom";
import { socialLogin } from "../api/auth/socialLogin";
import { saveTokens } from "../utils/tokenStorage";
import api from "../api/core/axios";

interface MemberInfo {
  provider: string;
  nickname: string;
  profileImage: string;
  languageId: number;
  languageCode: string;
}

export function useSocialLogin() {
  const navigate = useNavigate();

  async function handleSocialLogin(
    provider: "kakao" | "naver" | "google",
    getAccessToken: () => Promise<string>
  ) {
    try {
      // 1) 소셜 SDK에서 발급된 토큰 얻기
      const socialAccessToken = await getAccessToken();

      // 2) 백엔드에 전달해서 우리 서비스용 access/refresh 토큰 받기
      const response = await socialLogin(provider, socialAccessToken);
      const { accessToken, refreshToken } = response.data;

      // 3) 토큰 저장
      await saveTokens(accessToken, refreshToken);

      // 4) 내 정보(언어 포함) 조회
      const memberRes = await api.get<{ data: MemberInfo }>(
        "/api/v1/members/me"
      );
      const memberInfo = memberRes.data.data;
      const { languageId, languageCode } = memberInfo;

      // 5) 로컬스토리지에 언어ID, 언어코드, 유저정보 저장
      localStorage.setItem("languageId", languageId.toString());
      localStorage.setItem("languageCode", languageCode);
      localStorage.setItem("userInfo", JSON.stringify(memberInfo));

      // 6) 홈으로 이동
      navigate("/home", { replace: true });
    } catch (error) {
      console.error(`${provider} 로그인 실패`, error);
      navigate("/intro", { replace: true });
    }
  }

  return { handleSocialLogin };
}
