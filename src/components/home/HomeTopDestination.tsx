import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

  // 중국어 간체
  首尔市: null,
  市中心区: "CENTRAL",
  西南区: "SOUTHWEST",
  西北区: "NORTHWEST",
  东北区: "NORTHEAST",
  东南区: "SOUTHEAST",
};

export default function HomeTopDestination() {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState("");
  const [destinations, setDestinations] = useState<AttractionSummary[]>([]);
  const [nearbyDestinations, setNearbyDestinations] = useState<
    AttractionSummary[]
  >([]);
  const navigate = useNavigate();

  const languageId = 1; // TODO: 로그인 유저 기준으로 설정
  const cities = t("home.cities", { returnObjects: true }) as string[];

  useEffect(() => {
    if (cities.length > 0 && !selectedCity) {
      setSelectedCity(cities[0]);
    }
  }, [cities, selectedCity]);

  const fetchNearbyAttractions = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/attractions/nearby`, {
        params: {
          latitude: 37.5665,
          longitude: 126.978,
          radius: 5000,
          languageId,
        },
      });
      setNearbyDestinations(response.data.data);
    } catch (error) {
      console.error("Failed to fetch nearby attractions", error);
    }
  }, [languageId]);

  const fetchDestinations = useCallback(async () => {
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
  }, [selectedCity, languageId]);

  useEffect(() => {
    if (selectedCity) {
      fetchDestinations();
    }
  }, [selectedCity, fetchDestinations]);

  useEffect(() => {
    fetchNearbyAttractions();
  }, [fetchNearbyAttractions]);

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
        <h2 className="top-destination-title">{t("home.mostVisited")}</h2>
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
        <h2 className="top-destination-title">{t("home.nearby")}</h2>
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
