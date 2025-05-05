import { useEffect, useRef } from "react";
import { ColoredPolylineSection } from "../../types/routeDetail";
import { getNaverMapLanguageCode } from "../../utils/getLanguageId";

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
  const myLocationMarkerRef = useRef<naver.maps.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // naver.maps가 완전히 로드될 때까지 기다리는 유틸 함수
  const waitForNaverMaps = (callback: () => void) => {
    const check = () => {
      if (window.naver && window.naver.maps) {
        callback();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  };

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

      // 내 위치 실시간 추적 마커
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const current = new naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

            if (!myLocationMarkerRef.current) {
              myLocationMarkerRef.current = new naver.maps.Marker({
                position: current,
                map,
                icon: {
                  content: `<div style="width:16px;height:16px;background:#4285F4;border:2px solid white;border-radius:50%;box-shadow:0 0 6px rgba(66,133,244,0.6);"></div>`,
                  anchor: new naver.maps.Point(8, 8),
                },
              });
            } else {
              myLocationMarkerRef.current.setPosition(current);
            }
          },
          console.error,
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 10_000,
          }
        );
      }

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
      waitForNaverMaps(loadMap);
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      const langCode = getNaverMapLanguageCode();
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}&language=${langCode}`;
      script.async = true;
      script.onload = () => waitForNaverMaps(loadMap);
      document.head.appendChild(script);
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      mapInstanceRef.current?.destroy?.();
      mapInstanceRef.current = null;
      myLocationMarkerRef.current = null;
    };
  }, [sections, start, end]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />;
}
