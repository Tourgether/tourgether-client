import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PageContainer from "../components/common/PageContainer";
import { RouteHeader } from "../components/route/RouteHeader";
import { RouteFilterTabs, TabType } from "../components/route/RouteFilterTabs";
import { RouteCardList } from "../components/route/RouteCardList";
import { fetchRoutes } from "../api/routeApi";
import { Route } from "../types/route";

interface LocationState {
  destination?: {
    name: string;
    lat: number;
    lng: number;
    id: string;
  };
}

export default function RouteZPage() {
  const { state } = useLocation() as { state?: LocationState };
  const destination = state?.destination;

  const [routes, setRoutes] = useState<Route[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [start, setStart] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!destination) return;

    navigator.geolocation.getCurrentPosition(
      async () => {
        // TODO: 고정좌표 -> 실제좌표로
        // const startX = pos.coords.longitude;
        // const startY = pos.coords.latitude;
        const startX = 126.970833;
        const startY = 37.554722;

        const endX = destination.lng;
        const endY = destination.lat;

        const fetchedRoutes = await fetchRoutes(startX, startY, endX, endY);
        setStart({ lat: startY, lng: startX });
        setRoutes(fetchedRoutes);
      },
      (err) => {
        console.error("위치 정보를 불러오지 못했습니다", err);
      },
      { enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10_000
     }
    );
  }, [destination]);

  const filteredRoutes = useMemo(() => {
    if (activeTab === "All") return routes;
    if (activeTab === "Bus") return routes.filter((route) =>
      route.subPath.some((p) => p.trafficType === 2)
    );
    if (activeTab === "Subway") return routes.filter((route) =>
      route.subPath.some((p) => p.trafficType === 1)
    );
    return routes;
  }, [routes, activeTab]);

  return (
    <PageContainer>
      <RouteHeader
        start="My Location"
        destination={destination?.name || "Unknown Destination"}
      />
      <RouteFilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {start && destination && (
        <RouteCardList
          routes={filteredRoutes}
          start={start}
          end={{ lat: destination.lat, lng: destination.lng }}
          destName={destination.name}
          id={destination.id}
        />
      )}
    </PageContainer>
  );
}
