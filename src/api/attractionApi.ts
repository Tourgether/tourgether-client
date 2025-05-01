import api from "./core/axios";

export interface AttractionSummary {
  id: number;
  name: string;
  address: string;
  summary: string;
  thumbnailImgUrl: string;
}

export const fetchAttractionsByKeyword = async (
  lang: number,
  keyword: string
): Promise<AttractionSummary[]> => {
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
  languageId: number = 1
): Promise<AttractionMapSummary[]> => {
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
