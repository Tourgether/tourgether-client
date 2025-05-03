import api from "./core/axios";
import { getLanguageId } from "../../src/utils/getLanguageId";

export interface AttractionSummary {
  id: number;
  name: string;
  address: string;
  summary: string;
  thumbnailImgUrl: string;
}

export const fetchAttractionsByKeyword = async (
  overrideLangId: number | undefined,
  keyword: string
): Promise<AttractionSummary[]> => {
  const lang = overrideLangId ?? getLanguageId();
  const response = await api.get("/api/v1/attractions", {
    params: { lang, keyword },
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "API 호출 실패");
  }
  return response.data.data;
};

export interface AttractionMapSummary {
  id: number;
  name: string;
  address: string;
  thumbnailImgUrl: string;
  latitude: number;
  longitude: number;
}

export const fetchAttractionsWithinBounds = async (
  swLat: number,
  swLng: number,
  neLat: number,
  neLng: number,
  overrideLangId?: number
): Promise<AttractionMapSummary[]> => {
  const languageId = overrideLangId ?? getLanguageId();

  const response = await api.get("/api/v1/attractions/bounds", {
    params: { swLat, swLng, neLat, neLng, languageId },
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "지도 범위 관광지 조회 실패");
  }
  return response.data.data;
};

export interface LevelDescription {
  id: number;
  description: string;
}

// 번역 ID 기반 Level 설명 조회
export const fetchAttractionLevels = async (
  translationId: string
): Promise<LevelDescription[]> => {
  const response = await api.get(`/api/v1/attractions/${translationId}/levels`);

  if (!response.data.success) {
    throw new Error(response.data.message || "단계 설명 조회 실패");
  }

  return response.data.data;
};
