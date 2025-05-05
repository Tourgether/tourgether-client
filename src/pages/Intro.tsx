// src/pages/Intro.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKakaoInit } from "../hooks/oauth/useKakaoInit";
import { useNaverInit } from "../hooks/oauth/useNaverInit";
import { getAccessToken } from "../utils/tokenStorage";
import api from "../api/core/axios";
import IntroLogo from "../components/intro/IntroLogo";
import SocialLoginButtons from "../components/intro/SocialLoginButtons";
import "../styles/Intro.css";
import LoadingOverlay from "./LoadingOverlay";

interface MemberInfo {
  provider: string;
  nickname: string;
  profileImage: string;
  languageId: number;
  languageCode: string;
}

export default function Intro() {
  useKakaoInit();
  useNaverInit();

  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkAlreadyLoggedIn() {
      const token = await getAccessToken();

      if (!token) {
        // 토큰이 없으면 로그인 버튼 보여주기
        setShowButtons(true);
        setIsCheckingToken(false);
        return;
      }

      try {
        // 1) 토큰 유효성 검증
        await api.get("/api/v1/auth/me");

        // 2) 회원 정보(언어 포함) 가져오기
        const res = await api.get<{ data: MemberInfo }>("/api/v1/members/me");
        const { languageId, languageCode } = res.data.data;

        // 3) 로컬 스토리지에 모두 저장
        localStorage.setItem("languageId", languageId.toString());
        localStorage.setItem("languageCode", languageCode);
        localStorage.setItem("userInfo", JSON.stringify(res.data.data));
        console.log("languageId (value):", languageId);
        console.log("languageId (type):", typeof languageId);

        if (languageId === 0) {
          console.log("/language = " + languageId);
          navigate("/language", {
            state: { standalone: true },
            replace: true,
          });
          return;
        }

        // 4) 홈으로 리다이렉트
        navigate("/home", { replace: true });
      } catch (err) {
        // 토큰은 있지만 만료됐거나 불러오기 실패 시,
        // 로그인 버튼 보여주고 로딩 스피너 숨기기
        console.warn("토큰 검증 또는 회원정보 조회 실패:", err);
        setShowButtons(true);
        setIsCheckingToken(false);
      }
    }

    checkAlreadyLoggedIn();
  }, [navigate]);

  return (
    <div className="intro-layout">
      <div className="intro-background">
        <IntroLogo />
        {showButtons && (
          <SocialLoginButtons show={showButtons} setIsLoading={setIsLoading} />
        )}
      </div>
      {(isCheckingToken || isLoading) && <LoadingOverlay />}
    </div>
  );
}
