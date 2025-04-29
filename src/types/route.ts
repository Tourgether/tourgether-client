/** 지하철·버스 정류장 */
export interface Station {
    index: number;
    stationID: number;
    stationName: string;
    x: number;
    y: number;
    stationCityCode?: number | null;
    stationProviderCode?: number | null;
    localStationID?: number | string | null;
    arsID?: string | null;
    isNonStop?: boolean | string | null;
    [key: string]: unknown;
  }
  
  /** 정류장 배열 래퍼 */
  export interface PassStopList {
    stations: Station[];
  }
  
  /** 노선(버스 또는 지하철) */
  export interface Lane {
    type?: number | null;
    name?: string | string[] | null;
    subwayCode?: number | null;
    busNo?: string | null;
    busID?: number | null;
    busLocalBlID?: number | string | null;
    busCityCode?: number | null;
    busProviderCode?: number | null;
    subwayCityCode?: number | null;
    [key: string]: unknown;
  }
  
  /** 경로의 한 구간(도보·버스·지하철) */
  export interface SubPath {
    trafficType: number;         // 1 - 지하철 / 2 - 버스 / 3 - 도보
    sectionTime: number;
    distance?: number | null;
    stationCount?: number | null;
    intervalTime?: number | null;
    startName?: string | null;
    endName?: string | null;
    lane?: Lane[] | null;
    passStopList?: PassStopList | null;
    // 좌표 & ID 필드
    startX?: number | null;
    startY?: number | null;
    endX?: number | null;
    endY?: number | null;
    startID?: number | null;
    endID?: number | null;
    // 기타
    way?: string | null;
    wayCode?: number | null;
    door?: string | null;
    startExitNo?: string | null;
    endExitNo?: string | null;
    [key: string]: unknown;
  }
  
  /** 경로 요약 정보 */
  export interface PathInfo {
    totalTime: number;
    payment: number;
    firstStartStation: string;
    lastEndStation: string;
    totalWalk?: number | null;
    trafficDistance?: number | null;
    busTransitCount?: number | null;
    subwayTransitCount?: number | null;
    totalStationCount?: number | null;
    mapObj?: string | null;
    totalDistance?: number | null;
    totalWalkTime?: number | null;
    totalIntervalTime?: number | null;
    checkIntervalTime?: number | null;
    checkIntervalTimeOverYn?: string | null;
    [key: string]: unknown;
  }
  
  /** 하나의 추천 경로 */
  export interface Route {
    pathType: number;   // 1: 지하철 / 2: 버스 / 3: 혼합 …
    info: PathInfo;
    subPath: SubPath[];
  }
  