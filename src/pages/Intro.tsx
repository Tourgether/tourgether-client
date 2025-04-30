import { useEffect, useState } from "react";
import { useKakaoInit } from "../hooks/oauth/useKakaoInit";
import IntroLogo from "../components/intro/IntroLogo";
import SocialLoginButtons from "../components/intro/SocialLoginButtons";
import "../styles/Intro.css";
import { useNaverInit } from "../hooks/oauth/useNaverInit";

export default function Intro() {
  useKakaoInit();
  useNaverInit();

  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="intro-layout">
        <div className="intro-background">
          <IntroLogo />
          <SocialLoginButtons show={showButtons} />
        </div>
      </div>
    </>
  );
}
