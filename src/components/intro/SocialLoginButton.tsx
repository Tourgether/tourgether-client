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
  return (
    <button className={`intro-button ${provider}`}>
      <div className="intro-button-content">
        <img src={logo} alt={`${provider} logo`} className="social-logo" />
        <span>{label}</span>
      </div>
    </button>
  );
}
