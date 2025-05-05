// src/components/common/StandalonePageContainer.tsx
import React from "react";
import "../styles/LanguagePageNewbie.css";

interface Props {
  children: React.ReactNode;
}

export default function LanguagePageNewbie({ children }: Props) {
  return (
    <div className="lang-noob-container">
      <p className="lang-noob-comment">
        Let's Tourgether! <br />
        Choose the Language
      </p>
      {children}
    </div>
  );
}
