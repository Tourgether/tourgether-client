import axios from "axios";
import { GraphPos } from "../types/routeDetail";
import { Route } from "../types/route";

/**
 * 출발지 좌표(startX/Y)와 도착지 좌표(endX/Y)를 기반으로 대중교통 경로 검색
 * @param startX 출발지 경도
 * @param startY 출발지 위도
 * @param endX 도착지 경도
 * @param endY 도착지 위도
 * @param lang 언어 코드 (기본값: 0)
 * @returns 추천 경로 리스트
 */
// TODO: lang
export const fetchRoutes = async (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  lang: number = 0
): Promise<Route[]> => {
  try {
    const response = await axios.get("/api/v1/route/search", {
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

// TODO: lang
export async function fetchRouteLane(mapObj: string, lang = 0): Promise<Lane[]> {
  try {
    const response = await axios.get("/api/v1/route/lane", {
      params: { mapObj, lang },
    });
    return response.data.data.result.lane;
  } catch (err) {
    console.error("폴리라인 데이터 가져오기 실패", err);
    return [];
  }
}
