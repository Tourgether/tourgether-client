import api from "./core/axios";
import { GraphPos } from "../types/routeDetail";
import { Route } from "../types/route";

export const fetchRoutes = async (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  lang: number = 0
): Promise<Route[]> => {
  try {
    const response = await api.get("/api/v1/route/search", {
      params: { startX, startY, endX, endY, lang },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "경로 검색 실패");
    }

    return response.data.data.result.path;
  } catch (err) {
    console.error("경로 검색 API 실패", err);
    return [];
  }
};

export interface Section {
  graphPos: GraphPos[];
}

export interface Lane {
  class: number;
  type: number;
  section: Section[];
}

export async function fetchRouteLane(
  mapObj: string,
  lang = 0
): Promise<Lane[]> {
  try {
    const response = await api.get("/api/v1/route/lane", {
      params: { mapObj, lang },
    });
    return response.data.data.result.lane;
  } catch (err) {
    console.error("폴리라인 데이터 가져오기 실패", err);
    return [];
  }
}
