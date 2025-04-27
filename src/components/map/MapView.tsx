import { useEffect, useRef } from 'react';

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    const scriptId = "naver-map-sdk";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      // TODO: language check
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}&language=en`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapContainerRef.current || !window.naver) return;

      mapRef.current = new window.naver.maps.Map(mapContainerRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.9780),
        zoom: 14,
        minZoom: 12,
        maxZoom: 18,
      });
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: "calc(100vh - 58px)"
      }}
    />
  );
}
