import { useEffect, useState } from "react";
import IntroLogo from "../components/intro/IntroLogo";
import SocialLoginButtons from "../components/intro/SocialLoginButtons";
import "../styles/Intro.css";

export default function Intro() {
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
