import { useEffect, useState } from "react";
import SocialLoginButton from "./SocialLoginButton";

interface SocialLoginButtonsProps {
  show: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function SocialLoginButtons({
  show,
  setIsLoading,
}: SocialLoginButtonsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setMounted(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className={`intro-button-wrapper ${mounted ? "visible" : ""}`}>
      <SocialLoginButton
        provider="kakao"
        label="Login with Kakao"
        logo="/assets/social/logo-kakao.svg"
        setIsLoading={setIsLoading}
      />
      <SocialLoginButton
        provider="naver"
        label="Login with Naver"
        logo="/assets/social/logo-naver.svg"
        setIsLoading={setIsLoading}
      />
      <SocialLoginButton
        provider="google"
        label="Sign in with Google"
        logo="/assets/social/logo-google.svg"
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
