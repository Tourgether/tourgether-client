import { useNavigate } from "react-router-dom";

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
            width: "100%",
            padding: "14px",
            background: "linear-gradient(to right, #6B7BFF, #B226A8)",
            border: "none",
            borderRadius: "999px",
            color: "white",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/quiz", {
              state: {
                location: destinationName,
                translationId: translationId,
              },
              replace: true,
            });
          }}
        >
          Continue Quiz
        </button>

        {/* Return to Home */}
        <button
          onClick={() => navigate("/home", { replace: true })}
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
          Return to Home
        </button>

        {/* 취소 (투명) */}
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
          Cancel
        </button>
      </div>
    </div>
  );
}
