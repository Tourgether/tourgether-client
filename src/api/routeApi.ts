import axios from "axios";
import { GraphPos } from "../types/routeDetail";

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
