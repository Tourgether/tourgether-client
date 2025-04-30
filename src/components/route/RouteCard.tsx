import { Route } from "../../types/route";
import "../../styles/RouteCard.css";
import { RouteProgressBar } from "./RouteProgressBar";
import { FaBus, FaSubway } from "react-icons/fa";
import { busRouteTypeColorMap, subwayRouteTypeColorMap } from "./RouteColors";
import { useNavigate } from "react-router-dom";

interface RouteCardProps {
  route: Route;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  destName: string;
}

export function RouteCard({ route, start, end, destName }: RouteCardProps) {
  const { totalTime, payment: rawPayment } = route.info;
  const payment = rawPayment ?? 0;
  const navigate = useNavigate();

  const getColor = (
    trafficType: number,
    subwayCode?: number,
    busType?: number
  ): string => {
    if (trafficType === 1 && subwayCode !== undefined) {
      return subwayRouteTypeColorMap[subwayCode] || "#4688F1";
    }
    if (trafficType === 2 && busType !== undefined) {
      return busRouteTypeColorMap[busType] || "#FFA500";
    }
    return "#A0A4A8";
  };

  const handleGoClick = () => {
    navigate("/route-detail", {
      state: { route, start, end, destName }
    });
  };

  return (
    <div className="route-card">
      <div className="route-header">
        <span className="route-time">{totalTime}분</span>
        <span className="route-cost">{payment.toLocaleString()}₩</span>
      </div>

      <RouteProgressBar subPaths={route.subPath} />

      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {route.subPath
          .filter((s) => s.trafficType !== 3)
          .map((s, idx) => {
            const isSubway = s.trafficType === 1;
            const lane = s.lane?.[0];
            const color = getColor(
              s.trafficType,
              lane?.subwayCode ?? undefined,
              lane?.type ?? undefined
            );

            const icon = isSubway ? <FaSubway color={color} /> : <FaBus color={color} />;
            const label = isSubway ? lane?.name || "지하철" : lane?.busNo || "버스";

            return (
              <div key={idx}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", fontSize: "13px", marginBottom: "4px" }}>
                  {icon}
                  <span>{label}</span>
                </div>
                <ul style={{ paddingLeft: "30px", margin: 0 }}>
                  {s.startName && (
                    <li style={{ fontSize: "13px", color: "#666", marginBottom: "5px", listStyleType: "disc" }}>
                      {s.startName} (탑승)
                    </li>
                  )}
                  {s.endName && (
                    <li style={{ fontSize: "13px", color: "#666", listStyleType: "disc" }}>
                      {s.endName} (하차)
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
      </div>

      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <button
          onClick={handleGoClick}
          style={{
            background: "linear-gradient(to right, #5B44E8, #C32BAD)",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: "999px",
            border: "none",
            fontWeight: "bold",
            fontSize: "14px",
            cursor: "pointer",
            width: "100%",
            maxWidth: "300px"
          }}
        >
          GO!
        </button>
      </div>
    </div>
  );
}
