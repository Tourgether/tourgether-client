import { useState, useMemo } from "react";
import PageContainer from "../components/common/PageContainer";
import { RouteHeader } from "../components/route/RouteHeader";
import { RouteFilterTabs, TabType } from "../components/route/RouteFilterTabs";
import { RouteCardList } from "../components/route/RouteCardList";
import { dummyRouteData } from "../data/dummyRouteData";
import { Route } from "../types/route";

export default function RoutePage() {
  const [activeTab, setActiveTab] = useState<TabType>("All");

  const allRoutes: Route[] = dummyRouteData.data.result.path;

  const filteredRoutes = useMemo(() => {
    if (activeTab === "All") return allRoutes;
    if (activeTab === "Bus") return allRoutes.filter((route) => route.subPath.some((p) => p.trafficType === 2));
    if (activeTab === "Subway") return allRoutes.filter((route) => route.subPath.some((p) => p.trafficType === 1));
    return allRoutes;
  }, [activeTab, allRoutes]);

  return (
    <PageContainer>
      <RouteHeader start="My Location" destination="Gyeongbokgung station" />
      <RouteFilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <RouteCardList routes={filteredRoutes} />
    </PageContainer>
  );
}
