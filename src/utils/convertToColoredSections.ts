import { ColoredPolylineSection, GraphPos } from "../types/routeDetail";
import { Lane } from "../api/routeApi"; // API 응답 타입
import {
  busRouteTypeColorMap,
  subwayRouteTypeColorMap,
} from "../components/route/RouteColors";

/**
 * clazz: 1 → 버스, 2 → 지하철, 그 외 → 도보
 * type: ODsay API에 정의된 노선 타입
 */
export function convertToColoredSections(lanes: Lane[]): ColoredPolylineSection[] {
  return lanes.flatMap((lane) => {
    const { class: clazz, type, section } = lane;

    let color = "#999999";
    if (clazz === 1) {
      color = busRouteTypeColorMap[type] || "#51D18E";
    } else if (clazz === 2) {
      color = subwayRouteTypeColorMap[type] || "#5C9EFF";
    }

    const isDashed = clazz !== 1 && clazz !== 2;

    return section.map((s) => ({
      graphPos: s.graphPos as GraphPos[],
      color,
      dashed: isDashed,
    }));
  });
}
