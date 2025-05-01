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

export default function Intro() {
  useKakaoInit();
  useNaverInit();

  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // 로그인 요청 상태

  useEffect(() => {
    async function checkAlreadyLoggedIn() {
      const token = await getAccessToken();
      if (token) {
        try {
          await api.get("/api/v1/auth/me");
          navigate("/home", { replace: true });
        } catch {
          setTimeout(() => setShowButtons(true), 1000);
          setIsCheckingToken(false);
        }
      } else {
        setTimeout(() => setShowButtons(true), 1000);
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
