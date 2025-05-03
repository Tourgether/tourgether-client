import { useSocialLogin } from "../../hooks/useSocialLogin";
import { useLoginWithGoogle } from "../../hooks/oauth/useLoginWithGoogle";
import { useLoginWithKakao } from "../../hooks/oauth/useLoginWithKakao";
import { useLoginWithNaver } from "../../hooks/oauth/useLoginWithNaver";

interface SocialLoginButtonProps {
  provider: "kakao" | "naver" | "google";
  label: string;
  logo: string;
  setIsLoading: (loading: boolean) => void;
}

export default function SocialLoginButton({
  provider,
  label,
  logo,
  setIsLoading,
}: SocialLoginButtonProps) {
  const { handleSocialLogin } = useSocialLogin();
  const loginWithKakao = useLoginWithKakao();
  const loginWithNaver = useLoginWithNaver();
  const loginWithGoogle = useLoginWithGoogle();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      if (provider === "kakao") {
        await handleSocialLogin("kakao", loginWithKakao);
      } else if (provider === "naver") {
        await handleSocialLogin("naver", loginWithNaver);
      } else {
        await handleSocialLogin("google", loginWithGoogle);
      }
    } finally {
      setIsLoading(false);
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
