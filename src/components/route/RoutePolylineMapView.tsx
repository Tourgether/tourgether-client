import { useEffect, useRef } from "react";
import { ColoredPolylineSection } from "../../types/routeDetail";

interface Coord {
  lat: number;
  lng: number;
}

interface RoutePolylineMapViewProps {
  sections: ColoredPolylineSection[];
  start: Coord;
  end: Coord;
}

export default function RoutePolylineMapView({ sections, start, end }: RoutePolylineMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    const scriptId = "naver-map-sdk";

    const loadMap = () => {
      if (!window.naver || !mapContainerRef.current) return;

      const center = new naver.maps.LatLng(start.lat, start.lng);
      const map = new naver.maps.Map(mapContainerRef.current, {
        center,
        zoom: 15,
      });
      mapInstanceRef.current = map;

      // START 마커
      new naver.maps.Marker({
        position: new naver.maps.LatLng(start.lat, start.lng),
        map,
        icon: {
          url: "/assets/start-pin.png",
          size: new naver.maps.Size(60, 60),
          scaledSize: new naver.maps.Size(50, 50),
          anchor: new naver.maps.Point(25, 50),
        },
      });

      // END 마커
      new naver.maps.Marker({
        position: new naver.maps.LatLng(end.lat, end.lng),
        map,
        icon: {
          url: "/assets/end-pin.png",
          size: new naver.maps.Size(60, 60),
          scaledSize: new naver.maps.Size(50, 50),
          anchor: new naver.maps.Point(25, 50),
        },
      });

      // 폴리라인
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
      // TODO : language
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}&language=en`;
      script.async = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    }

    return () => {
      mapInstanceRef.current?.destroy?.();
      mapInstanceRef.current = null;
    };
  }, [sections, start, end]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />;
}
