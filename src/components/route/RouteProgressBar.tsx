import { SubPath } from "../../types/route";
import { FaBus, FaSubway, FaWalking } from "react-icons/fa";
import { busRouteTypeColorMap, subwayRouteTypeColorMap } from "./RouteColors";

interface RouteProgressBarProps {
  subPaths: SubPath[];
}

const getColor = (subPath: SubPath): string => {
  if (subPath.trafficType === 1) {
    const subwayCode = subPath.lane?.[0]?.subwayCode;
    return subwayCode ? subwayRouteTypeColorMap[subwayCode] || "#5C9EFF" : "#5C9EFF";
  }
  if (subPath.trafficType === 2) {
    const busType = subPath.lane?.[0]?.type;
    return busType ? busRouteTypeColorMap[busType] || "#51D18E" : "#51D18E";
  }
  return "#A0A4A8";
};

const getIcon = (type: number) => {
  switch (type) {
    case 1: return <FaSubway size={12} />;
    case 2: return <FaBus size={12} />;
    default: return <FaWalking size={12} />;
  }
};

export function RouteProgressBar({ subPaths }: RouteProgressBarProps) {
  return (
    <div style={{
      display: "flex",
      borderRadius: "999px",
      overflow: "hidden",
      height: "18px",
      backgroundColor: "#e0e0e0"
    }}>
      {subPaths.map((s, i) => {
        const color = getColor(s);
        const icon = getIcon(s.trafficType);

        const flexGrow = s.sectionTime;
        const minWidth = s.sectionTime <= 3 ? 50 : 48;

        return (
          <div
            key={i}
            style={{
              flexGrow,
              flexShrink: 0,
              flexBasis: 0,
              minWidth: `${minWidth}px`,
              backgroundColor: color,
              position: "relative"
            }}
          >
            <div style={{
              position: "absolute",
              left: "1px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              {icon}
            </div>

            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
              fontSize: "8px",
              fontWeight: 600,
              whiteSpace: "nowrap"
            }}>
              {s.sectionTime}min
            </div>
          </div>
        );
      })}
    </div>
  );
}
