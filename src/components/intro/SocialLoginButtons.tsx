import SocialLoginButton from "./SocialLoginButton";

interface SocialLoginButtonsProps {
  show: boolean;
}

export default function SocialLoginButtons({ show }: SocialLoginButtonsProps) {
  return (
    <div className={`intro-button-wrapper ${show ? "visible" : ""}`}>
      <SocialLoginButton
        provider="kakao"
        label="Login with Kakao"
        logo="/assets/social/logo-kakao.svg"
      />
      <SocialLoginButton
        provider="naver"
        label="Login with Naver"
        logo="/assets/social/logo-naver.svg"
      />
      <SocialLoginButton
        provider="google"
        label="Login with Google"
        logo="/assets/social/logo-google.svg"
      />
    </div>
  );
}
