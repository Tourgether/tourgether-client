interface RouteHeaderProps {
  start: string;
  destination: string;
}

export function RouteHeader({ start, destination }: RouteHeaderProps) {
  return (
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
  );
}
