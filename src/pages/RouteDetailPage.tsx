import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Route } from "../types/route";
import { fetchRouteLane } from "../api/routeApi";
import { ColoredPolylineSection } from "../types/routeDetail";
import RoutePolylineMapView from "../components/route/RoutePolylineMapView";
import { convertToColoredSections } from "../utils/convertToColoredSections";

interface Coord {
  lat: number;
  lng: number;
}

export default function RouteDetailPage() {
  const location = useLocation() as {
    state: {
      route: Route;
      start: Coord;
      end: Coord;
    };
  };

  const mapObj = location.state?.route.info.mapObj;
  const start = location.state?.start;
  const end = location.state?.end;

  const [sections, setSections] = useState<ColoredPolylineSection[]>([]);

  useEffect(() => {
    if (!mapObj) return;

    fetchRouteLane(mapObj).then((lanes) => {
      const colored = convertToColoredSections(lanes);
      setSections(colored);
    });
  }, [mapObj]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <RoutePolylineMapView sections={sections} start={start} end={end} />
    </div>
  );
}
