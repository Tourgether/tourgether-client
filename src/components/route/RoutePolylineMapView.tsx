import { useEffect, useRef } from "react";
import { ColoredPolylineSection } from "../../types/routeDetail";

interface RoutePolylineMapViewProps {
  sections: ColoredPolylineSection[];
}

export default function RoutePolylineMapView({ sections }: RoutePolylineMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    const scriptId = "naver-map-sdk";

    const loadMap = () => {
      if (!window.naver || !mapContainerRef.current) return;

      const center = new naver.maps.LatLng(37.5665, 126.978);
      const map = new naver.maps.Map(mapContainerRef.current, {
        center,
        zoom: 15,
      });
      mapInstanceRef.current = map;

      // 폴리라인 그리기
      sections.forEach((section) => {
        const path = section.graphPos.map((p) => new naver.maps.LatLng(p.y, p.x));
        new naver.maps.Polyline({
          map,
          path,
          strokeColor: section.color,
          strokeWeight: 6,
          strokeOpacity: 0.9,
        });
      });
    };

    if (document.getElementById(scriptId)) {
      loadMap();
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      // TODO: language
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}&language=en`;
      script.async = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    }

    return () => {
      mapInstanceRef.current?.destroy?.();
      mapInstanceRef.current = null;
    };
  }, [sections]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />;
}
