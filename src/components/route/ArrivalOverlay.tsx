import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api/core/axios";
import { FaPlay, FaPause } from "react-icons/fa";
import { Trans } from "react-i18next";
import PageContainer from "../common/PageContainer";

interface Props {
  visible: boolean;
  destinationName: string;
  translationId: string;
  attractionId: number,
  onCancel: () => void;
}

export default function ArrivalOverlay({
  visible,
  destinationName,
  translationId,
  attractionId,
  onCancel,
}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [audioText, setAudioText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!visible) return;

    const fetchAttractionDetail = async () => {
      try {
        const res = await api.get(`/api/v1/attractions/${translationId}`);
        const data = res.data.data;
        setAudioText(data.audioText || "");
        setAudioUrl(data.audioUrl || "");
      } catch (err) {
        console.error("오디오 데이터 조회 실패", err);
      }
    };

    fetchAttractionDetail();
  }, [visible, translationId]);

  const postVisit = async () => {
    try {
      await api.post("/api/v1/visits", {
        attractionId: attractionId,
      });
    } catch (err) {
      console.error("방문 기록 실패:", err);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!visible) return null;

  return (
    <PageContainer>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.65)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "48px 24px",
          fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
        }}
      >
       <h2
        style={{
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "32px",
        }}
        >
        <Trans
            i18nKey="arrival.arrivedAt"
            values={{ destination: destinationName }}
            components={[<span style={{ color: "#FFD700" }} />]}
        />
        </h2>

        {audioText && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              padding: "20px",
              borderRadius: "16px",
              color: "white",
              fontSize: "16px",
              lineHeight: 1.6,
              textAlign: "center",
              maxWidth: "380px",
            }}
          >
            {audioText}
          </div>
        )}

        {audioUrl && (
          <div style={{ marginTop: "12px", marginBottom: "20px" }}>
            <audio ref={audioRef} src={audioUrl} preload="auto" />
            <button
              onClick={toggleAudio}
              style={{
                padding: "10px 20px",
                background: "white",
                border: "none",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
              {isPlaying ? t("arrival.pause") : t("arrival.play")}
            </button>
          </div>
        )}

        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <button
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(to right, #5B44E8, #C32BAD)",
              border: "none",
              borderRadius: "999px",
              color: "white",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
            }}
            onClick={async () => {
              await postVisit();
              navigate("/quiz", {
                state: {
                  location: destinationName,
                  translationId,
                },
                replace: true,
              });
            }}
          >
            {t("arrival.continueQuiz")}
          </button>

          <button
            onClick={async () => {
              await postVisit();
              navigate("/home", { replace: true });
            }}
            style={{
              width: "100%",
              padding: "14px",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "999px",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            {t("arrival.goHome")}
          </button>

          <button
            onClick={onCancel}
            style={{
              width: "100%",
              padding: "14px",
              background: "transparent",
              border: "1px solid white",
              borderRadius: "999px",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
              color: "white",
            }}
          >
            {t("arrival.cancel")}
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
