import { useEffect, useRef, useState } from 'react';
import MyLocationButton from './MyLocationButton';

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef           = useRef<naver.maps.Map | null>(null);
  const myMarkerRef      = useRef<naver.maps.Marker | null>(null);
  const watchIdRef       = useRef<number | null>(null);

  const [userLocation, setUserLocation] = useState<naver.maps.LatLng | null>(null);

  useEffect(() => {
    /** 1) 네이버 지도 스크립트 로드 */
    const scriptId = 'naver-map-sdk';
    const loadMap = () => {
      if (!mapContainerRef.current || !window.naver) return;

      /** 2) 맵 인스턴스 생성 */
      const map = new window.naver.maps.Map(mapContainerRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.9780),
        zoom  : 14,
        minZoom: 12,
        maxZoom: 20,
      });
      mapRef.current = map;

      /** 3) 한 번만 현재 위치 가져와서 초기 center 설정 */
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const pos = new window.naver.maps.LatLng(coords.latitude, coords.longitude);
            map.setCenter(pos);
            setUserLocation(pos);
            drawOrMoveMyMarker(pos);
          },
          console.error,
          { enableHighAccuracy: true, timeout: 8000 }
        );

        /** 4) 지속 추적 → watchIdRef 에 저장 */
        watchIdRef.current = navigator.geolocation.watchPosition(
          ({ coords }) => {
            const pos = new window.naver.maps.LatLng(coords.latitude, coords.longitude);
            setUserLocation(pos);
            drawOrMoveMyMarker(pos);
          },
          console.error,
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
        );
      } else {
        console.error('브라우저가 Geolocation을 지원하지 않습니다.');
      }
    };

    const drawOrMoveMyMarker = (position: naver.maps.LatLng) => {
      if (!myMarkerRef.current && mapRef.current) {
        myMarkerRef.current = new window.naver.maps.Marker({
          position,
          map: mapRef.current,
          icon: {
            content:
              `<div style="width:14px;height:14px;background:#4285F4;border:2px solid #fff;
                         border-radius:50%;box-shadow:0 0 6px rgba(66,133,244,.6);"></div>`,
            anchor: new window.naver.maps.Point(7, 7),
          },
        });
      } else {
        myMarkerRef.current?.setPosition(position);
      }
    };

    /* -------- 스크립트가 이미 있으면 바로 init -------- */
    if (document.getElementById(scriptId)) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}&language=en`;
      script.async = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    }

    /** 5) 클린업 – 반드시 watch를 해제해 줘야 다음 진입 때 정상 동작 */
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (mapRef.current) {
  (mapRef.current as naver.maps.Map & { destroy?: () => void }).destroy?.();
  mapRef.current = null;
}
    };
  }, []);

  /* "내 위치" 버튼 */
  const moveToMyLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setZoom(16);
      mapRef.current.setCenter(userLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const pos = new window.naver.maps.LatLng(coords.latitude, coords.longitude);
          mapRef.current?.setZoom(16);
          mapRef.current?.setCenter(pos);
        },
        console.error,
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 58px)' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <MyLocationButton onClick={moveToMyLocation} />
    </div>
  );
}
