import { useEffect, useState } from "react";
import { MdRecordVoiceOver } from "react-icons/md";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import { fetchAttractionLevels, LevelDescription } from "../../api/attractionApi";

type SupportedLang = "ko" | "en" | "ja" | "zh";

interface DocentTooltipProps {
  visible: boolean;
  language: SupportedLang;
  translationId: string;
  name: string;
}

const langCodes: Record<SupportedLang, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
};

export default function DocentTooltip({ visible, language, translationId, name }: DocentTooltipProps) {
  const [levels, setLevels] = useState<LevelDescription[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [, setIsPaused] = useState(false);

  const lang = langCodes[language];
  const currentText = levels[currentIndex]?.description || "";

  useEffect(() => {
    if (!translationId) return;
    fetchAttractionLevels(translationId)
      .then(setLevels)
      .catch(console.error);
  }, [translationId]);

  useEffect(() => {
    const loadVoice = () => {
      const voices = speechSynthesis.getVoices();
      const selected =
        voices.find((v) => v.lang === lang) ||
        null;
      setVoice(selected);
    };

    if (speechSynthesis.getVoices().length > 0) loadVoice();
    else speechSynthesis.onvoiceschanged = loadVoice;
  }, [language, lang]);

  const speak = () => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.lang = lang;
    if (voice) utterance.voice = voice;
    utterance.onend = () => setIsPaused(false);
    speechSynthesis.speak(utterance);
    setIsPaused(false);
  };

  const togglePlayPause = () => {
    if (!speechSynthesis.speaking) {
      speak();
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPaused(false);
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      speechSynthesis.cancel();
      setIsPaused(false);
    }
  };

  const goNext = () => {
    if (currentIndex < levels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      speechSynthesis.cancel();
      setIsPaused(false);
    }
  };

  if (!visible || levels.length === 0) return null;

  const isPlaying = speechSynthesis.speaking && !speechSynthesis.paused;
  const isPausedState = speechSynthesis.paused;

  return (
    <div
      style={{
        position: "fixed",
        top: "calc(env(safe-area-inset-top, 0px) + 100px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 16px)",
        maxWidth: 428,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 16,
        padding: 20,
        boxSizing: "border-box",
        boxShadow: "0 2px 12px rgba(0,0,0,.2)",
        zIndex: 1001,
      }}
    >
      {/* 꼬리 */}
      <div
        style={{
          position: "absolute",
          top: -10,
          left: "90%",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: "12px solid #fff",
        }}
      />

      {/* 제목 */}
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <MdRecordVoiceOver size={22} color="#9B28FF" />
        Description
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={togglePlayPause}
            style={{
              ...buttonStyle,
            }}
            title={isPausedState ? "재생" : isPlaying ? "일시정지" : "재생"}
          >
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>
          <button onClick={stop} style={buttonStyle} title="정지">
            <FaStop size={16} />
          </button>
        </div>
      </h3>

      {/* 관광지 이름 */}
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 6,
          color: "#111",
          letterSpacing: "-0.2px",
        }}
      >
        {name}
      </h2>

      {/* 본문 설명 */}
      <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>{currentText}</p>

      {/* 이전/다음 */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          style={{
            ...navButton,
            opacity: currentIndex === 0 ? 0.4 : 1,
            cursor: currentIndex === 0 ? "default" : "pointer",
          }}
        >
          〈
        </button>

        <span style={{ fontSize: 13, color: "#888" }}>
          {currentIndex + 1} / {levels.length}
        </span>

        <button
          onClick={goNext}
          disabled={currentIndex === levels.length - 1}
          style={{
            ...navButton,
            opacity: currentIndex === levels.length - 1 ? 0.4 : 1,
            cursor: currentIndex === levels.length - 1 ? "default" : "pointer",
          }}
        >
           〉
        </button>
      </div>
    </div>
  );
}

// 버튼 스타일 공통
const buttonStyle = {
  background: "#f0f0f0",
  border: "none",
  borderRadius: 8,
  padding: "6px 10px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// 이전/다음 네비게이션 버튼
const navButton = {
  ...buttonStyle,
  minWidth: 60,
};
