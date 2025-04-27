import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DestinationName from "../home/DestinationName";
import "../../styles/HomeTopDestination.css";

interface AttractionSummary {
  id: number;
  name: string;
  address: string;
  summary: string;
  thumbnailImgUrl: string;
}

interface FetchDestinationsParams {
  languageId: number;
  limit: number;
  area?: string;
}

// 언어별 cities 목록
const citiesByLanguage: { [key: number]: string[] } = {
  1: ["서울시", "도심권", "서남권", "서북권", "동북권", "동남권"],
  2: [
    "Seoul",
    "Central Area",
    "Southwest Area",
    "Northwest Area",
    "Northeast Area",
    "Southeast Area",
  ],
  3: ["ソウル市", "都心圏", "南西圏", "北西圏", "北東圏", "南東圏"],
  4: ["首尔市", "市中心区", "西南区", "西北区", "东北区", "东南区"], // zh-CN 간체
};

// 도시 이름 → 서버 area 코드 매핑
const cityToAreaMap: { [key: string]: string | null } = {
  // 한국어
  서울시: null,
  도심권: "CENTRAL",
  서남권: "SOUTHWEST",
  서북권: "NORTHWEST",
  동북권: "NORTHEAST",
  동남권: "SOUTHEAST",

  // 영어
  Seoul: null,
  "Central Area": "CENTRAL",
  "Southwest Area": "SOUTHWEST",
  "Northwest Area": "NORTHWEST",
  "Northeast Area": "NORTHEAST",
  "Southeast Area": "SOUTHEAST",

  // 일본어
  ソウル市: null,
  都心圏: "CENTRAL",
  南西圏: "SOUTHWEST",
  北西圏: "NORTHWEST",
  北東圏: "NORTHEAST",
  南東圏: "SOUTHEAST",

  // 중국어 간체 (zh-CN)
  首尔市: null,
  市中心区: "CENTRAL",
  西南区: "SOUTHWEST",
  西北区: "NORTHWEST",
  东北区: "NORTHEAST",
  东南区: "SOUTHEAST",
};

const mostVisitedTitleByLanguage: { [key: number]: string } = {
  1: "가장 많이 방문한 명소", // 한국어
  2: "Top Destination", // 영어
  3: "最も訪問された名所", // 일본어
  4: "最受欢迎的景点", // 중국어 간체 (zh-CN)
};

const nearbyTitleByLanguage: { [key: number]: string } = {
  1: "근처 추천 명소", // 한국어
  2: "Nearby Attractions", // 영어
  3: "近くの観光地", // 일본어
  4: "附近景点推荐", // 중국어 간체
};

function getCities(languageId: number): string[] {
  return citiesByLanguage[languageId] || citiesByLanguage[1];
}

export default function HomeTopDestination() {
  const [selectedCity, setSelectedCity] = useState("서울시"); // 기본값 서울시
  const [destinations, setDestinations] = useState<AttractionSummary[]>([]);
  const [nearbyDestinations, setNearbyDestinations] = useState<
    AttractionSummary[]
  >([]);
  const navigate = useNavigate();

  const languageId = 1; // TODO: 실제 로그인된 사용자 언어에 맞게 설정
  const cities = getCities(languageId);

  async function fetchNearbyAttractions() {
    try {
      const response = await axios.get(`/api/v1/attractions/nearby`, {
        params: {
          latitude: 37.5665, // TODO: 서울시청으로 하드코딩
          longitude: 126.978,
          radius: 5000,
          languageId: languageId,
        },
      });
      setNearbyDestinations(response.data.data);
    } catch (error) {
      console.error("Failed to fetch nearby attractions", error);
    }
  }

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const params: FetchDestinationsParams = { languageId, limit: 10 };
        const area = cityToAreaMap[selectedCity];
        if (area) {
          params.area = area;
        }

        const response = await axios.get(`/api/v1/attractions/popular`, {
          params,
        });
        setDestinations(response.data.data);
      } catch (error) {
        console.error("Failed to fetch popular attractions", error);
      }
    }

    fetchDestinations();
    fetchNearbyAttractions();
  }, [selectedCity, languageId]);

  return (
    <>
      <div className="home-wrapper">
        <div className="city-slider">
          {cities.map((city) => (
            <button
              key={city}
              className={`city-item ${selectedCity === city ? "selected" : ""}`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="home-header">
        <h2 className="top-destination-title">
          {mostVisitedTitleByLanguage[languageId] || "Top Destination"}
        </h2>
      </div>

      <div className="destination-list">
        {destinations.map((destination) => (
          <div
            key={destination.id}
            className="destination-card"
            onClick={() =>
              navigate(`/attraction/${destination.id}`, {
                state: { thumbnailImgUrl: destination.thumbnailImgUrl },
              })
            }
            style={{ cursor: "pointer" }}
          >
            <img
              src={destination.thumbnailImgUrl}
              alt={destination.name}
              className="destination-image"
              style={{ borderRadius: "30px" }}
            />
            <div className="destination-info">
              <DestinationName name={destination.name} />
            </div>
          </div>
        ))}
      </div>

      <div className="home-header">
        <h2 className="top-destination-title">
          {nearbyTitleByLanguage[languageId] || "Nearby Attractions"}
        </h2>
      </div>

      <div className="destination-list">
        {nearbyDestinations.map((destination) => (
          <div
            key={destination.id}
            className="destination-card"
            onClick={() =>
              navigate(`/attraction/${destination.id}`, {
                state: { thumbnailImgUrl: destination.thumbnailImgUrl },
              })
            }
            style={{ cursor: "pointer" }}
          >
            <img
              src={destination.thumbnailImgUrl}
              alt={destination.name}
              className="destination-image"
              style={{ borderRadius: "30px" }}
            />
            <div className="destination-info">
              <DestinationName name={destination.name} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
