// src/hooks/useWithdraw.ts
import { useLoginWithGoogle } from "./oauth/useLoginWithGoogle";
import { useLoginWithKakao } from "./oauth/useLoginWithKakao";
import { useLoginWithNaver } from "./oauth/useLoginWithNaver";
import api from "../api/core/axios";
import { clearTokens } from "../utils/tokenStorage";
import { useNavigate } from "react-router-dom";

export function useWithdraw() {
  const navigate = useNavigate();
  const loginWithGoogle = useLoginWithGoogle();
  const loginWithKakao = useLoginWithKakao();
  const loginWithNaver = useLoginWithNaver();

  const withdraw = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const provider = userInfo.provider;

    if (!provider) {
      alert("소셜 로그인 정보가 없습니다.");
      return;
    }

    try {
      let socialAccessToken = "";

      if (provider === "KAKAO") {
        socialAccessToken = await loginWithKakao();
      } else if (provider === "NAVER") {
        socialAccessToken = await loginWithNaver();
      } else if (provider === "GOOGLE") {
        socialAccessToken = await loginWithGoogle();
      } else {
        alert("지원하지 않는 소셜 로그인입니다.");
        return;
      }

      await api.delete("/api/v1/members/me", {
        data: { socialAccessToken },
      });

      clearTokens();
      localStorage.clear();
      navigate("/");
    } catch (e) {
      console.error("회원 탈퇴 중 오류 발생:", e);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return { withdraw };
}
