import { useSocialLogin } from "../../hooks/useSocialLogin";
import { useLoginWithGoogle } from "../../hooks/oauth/useLoginWithGoogle";
import { useLoginWithKakao } from "../../hooks/oauth/useLoginWithKakao";
import { useLoginWithNaver } from "../../hooks/oauth/useLoginWithNaver";

interface SocialLoginButtonProps {
  provider: "kakao" | "naver" | "google";
  label: string;
  logo: string;
}

export default function SocialLoginButton({
  provider,
  label,
  logo,
}: SocialLoginButtonProps) {
  const { handleSocialLogin } = useSocialLogin();

  const loginWithKakao = useLoginWithKakao();
  const loginWithNaver = useLoginWithNaver();
  const loginWithGoogle = useLoginWithGoogle();

  const handleClick = () => {
    if (provider === "kakao") {
      handleSocialLogin("kakao", loginWithKakao);
    } else if (provider === "naver") {
      handleSocialLogin("naver", loginWithNaver);
    } else if (provider === "google") {
      handleSocialLogin("google", loginWithGoogle);
    }
  };

  return (
    <button className={`intro-button ${provider}`} onClick={handleClick}>
      <div className="intro-button-content">
        <img src={logo} alt={`${provider} logo`} className="social-logo" />
        <span>{label}</span>
      </div>
    </button>
  );
}
