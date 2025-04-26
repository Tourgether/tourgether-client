import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/HomeTopDestination.css";

interface AttractionSummary {
  id: number;
  name: string;
  address: string;
  summary: string;
  thumbnailImgUrl: string;
}

// 언어별 cities 분리
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
  4: ["首尔市", "市中心区", "西南区", "西北区", "东北区", "东南区"],
};

function getCities(languageId: number): string[] {
  return citiesByLanguage[languageId] || citiesByLanguage[1];
}

export default function HomeTopDestination() {
  const [selectedCity, setSelectedCity] = useState("서울시"); // TODO: languageId 변경
  const [destinations, setDestinations] = useState<AttractionSummary[]>([]);

  const languageId = 1; // 나중에 props나 글로벌 상태로 바꿀 수 있음

  const cities = getCities(languageId); // languageId에 맞는 cities 가져오기

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await axios.get(`/api/v1/attractions/popular`, {
          params: { languageId, limit: 10 },
        });
        setDestinations(response.data.data);
      } catch (error) {
        console.error("Failed to fetch popular attractions", error);
      }
    }

    fetchDestinations();
  }, [selectedCity]);

  return (
    <div className="home-wrapper">
      {/* 도시 선택 */}
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

      {/* Top Destination 제목 */}
      <h2 className="top-destination-title">Top Destination</h2>

      {/* Top Destination 카드 리스트 */}
      <div className="destination-list">
        {destinations.map((destination) => (
          <div key={destination.id} className="destination-card">
            <img
              src={destination.thumbnailImgUrl}
              alt={destination.name}
              className="destination-image"
              style={{ borderRadius: "30px" }}
            />
            <div className="destination-info">
              <div className="destination-name">{destination.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
