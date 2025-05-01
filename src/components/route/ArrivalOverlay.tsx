import { useNavigate } from "react-router-dom";
import api from "../../api/core/axios";

interface Props {
  visible: boolean;
  destinationName: string;
  translationId: string;
  onCancel: () => void;
}

export default function ArrivalOverlay({
  visible,
  destinationName,
  translationId,
  onCancel,
}: Props) {
  const navigate = useNavigate();
  if (!visible) return null;

  // 방문 기록 API 요청 함수
  const postVisit = async () => {
    try {
      await api.post("/api/v1/visits", {
        attractionId: Number(translationId),
      });
    } catch (err) {
      console.error("방문 기록 실패:", err);
    }
  };

  // 버튼 공통 스타일
  const fullButtonStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "999px",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
  } as const;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "48px 24px",
      }}
    >
      {/* 상단 텍스트 */}
      <h2
        style={{
          color: "white",
          fontSize: "20px",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        Arrived at {destinationName}!
      </h2>

      {/* 버튼 영역 (하단) */}
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
        {/* Continue Quiz */}
        <button
          style={{
            ...fullButtonStyle,
            background: "linear-gradient(to right, #6B7BFF, #B226A8)",
            border: "none",
            color: "white",
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
          Continue Quiz
        </button>

        {/* Return to Home */}
        <button
          style={{
            ...fullButtonStyle,
            background: "white",
            border: "1px solid #ccc",
          }}
          onClick={async () => {
            await postVisit();
            navigate("/home", { replace: true });
          }}
        >
          Return to Home
        </button>

        {/* 취소 */}
        <button
          style={{
            ...fullButtonStyle,
            background: "transparent",
            border: "1px solid white",
            color: "white",
          }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
