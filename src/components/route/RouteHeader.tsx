import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

interface RouteHeaderProps {
  start: string;
  destination: string;
}

export function RouteHeader({ start, destination }: RouteHeaderProps) {
  const navigate = useNavigate();

  return (
    <div>
      {/* 상단: 뒤로가기 + 로고 */}
      <div style={{
        position: "relative",
        height: "40px",
        marginBottom: "4px"
      }}>
        {/* 왼쪽: 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            fontSize: "22px",
            cursor: "pointer",
            color: "#333",
            zIndex: 1
          }}
          aria-label="Back"
        >
          <IoChevronBack />
        </button>

        {/* 중앙: 로고 */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <img
            src="/assets/logo/tourgether-logo.png"
            alt="Tourgether Logo"
            style={{ height: "20px", objectFit: "contain" }}
          />
        </div>
      </div>

      {/* 출발지/도착지 박스 */}
      <div style={{
        padding: "16px",
        borderRadius: "16px",
        backgroundColor: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        marginBottom: "16px"
      }}>
        {/* 출발지 */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            border: "4px solid #4CAF50",
            backgroundColor: "#fff"
          }} />
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>{start}</span>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "8px 0" }} />

        {/* 도착지 */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            border: "4px solid #FF5252",
            backgroundColor: "#fff"
          }} />
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>{destination}</span>
        </div>
      </div>
    </div>
  );
}
