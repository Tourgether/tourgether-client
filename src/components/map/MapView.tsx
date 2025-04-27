import { useEffect, useRef, useState } from 'react';
import MyLocationButton from './MyLocationButton';
import AttractionBottomSheet from './AttractionBottomSheet';
import { fetchAttractionsWithinBounds, AttractionMapSummary } from '../../api/attractionApi';
import "../../styles/AttractionBottomSheet.css"; 

/* ---------------- 하버사인 거리 계산 ---------------- */
const toRad = (deg: number) => (deg * Math.PI) / 180;
const distanceMeters = (a: number, b: number, c: number, d: number) => {
  const R = 6371_000;
  const dLat = toRad(c - a);
  const dLng = toRad(d - b);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a)) * Math.cos(toRad(c)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

/* ---------------- Coord → LatLng 변환 ---------------- */
const coordToLatLng = (c: naver.maps.Coord): naver.maps.LatLng =>
  c instanceof naver.maps.LatLng ? c : new naver.maps.LatLng(c.y, c.x);

/* ---------------- 줌 별 이동 거리 임계값 ---------------- */
const THRESHOLD_BY_ZOOM: Record<number, number> = {
  12: 1200,
  13: 800,
  14: 600,
  15: 400,
  16: 250,
  17: 150,
  18: 80,
  19: 40,
  20: 20,
};

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const myLocationMarkerRef = useRef<naver.maps.Marker | null>(null);
  const attractionMarkersRef = useRef<naver.maps.Marker[]>([]);
  const lastCenterRef = useRef<naver.maps.Coord | null>(null);
  const lastZoomRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const debounceTimerRef = useRef<number | undefined>(undefined);

  const [userLocation, setUserLocation] = useState<naver.maps.LatLng | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<AttractionMapSummary | null>(null);

  useEffect(() => {
    const scriptId = 'naver-map-sdk';

    const loadMap = () => {
      if (!mapContainerRef.current || !window.naver) return;

      const map = new window.naver.maps.Map(mapContainerRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.9780),
        zoom: 14,
        minZoom: 12,
        maxZoom: 20,
      });
      mapRef.current = map;

      /* idle + debounce */
      map.addListener('idle', () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = window.setTimeout(handleMapIdle, 500);
      });

      /* 내 위치 */
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const pos = new window.naver.maps.LatLng(coords.latitude, coords.longitude);
            map.setCenter(pos);
            setUserLocation(pos);
            drawOrMoveMyLocationMarker(pos);
          },
          console.error,
          { enableHighAccuracy: true, timeout: 8000 }
        );

        watchIdRef.current = navigator.geolocation.watchPosition(
          ({ coords }) => {
            const pos = new window.naver.maps.LatLng(coords.latitude, coords.longitude);
            setUserLocation(pos);
            drawOrMoveMyLocationMarker(pos);
          },
          console.error,
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
        );
      }
    };

    const handleMapIdle = async () => {
      if (!mapRef.current) return;

      const map = mapRef.current;
      const zoom = map.getZoom();
      const center = map.getCenter();
      const prevCenter = lastCenterRef.current;

      if (!prevCenter) {
        lastCenterRef.current = center;
        lastZoomRef.current = zoom;
      } else {
        const curLL = coordToLatLng(center);
        const prevLL = coordToLatLng(prevCenter);
        const moved = distanceMeters(curLL.lat(), curLL.lng(), prevLL.lat(), prevLL.lng());
        const threshold = THRESHOLD_BY_ZOOM[Math.round(zoom)] ?? 250;

        if (zoom === lastZoomRef.current && moved < threshold) {
          // 너무 조금 이동했으면 API 호출 생략
          return;
        }

        lastCenterRef.current = center;
        lastZoomRef.current = zoom;
      }

      try {
        const bounds = map.getBounds();
        if (!(bounds instanceof naver.maps.LatLngBounds)) return;

        const sw = bounds.getSW();
        const ne = bounds.getNE();

        const attractions = await fetchAttractionsWithinBounds(
          sw.lat(), sw.lng(), ne.lat(), ne.lng()
        );
        updateAttractionMarkers(attractions);
      } catch (error) {
        console.error('관광지 조회 실패', error);
      }
    };

    const drawOrMoveMyLocationMarker = (p: naver.maps.LatLng) => {
      if (!mapRef.current) return;
      if (!myLocationMarkerRef.current) {
        myLocationMarkerRef.current = new window.naver.maps.Marker({
          position: p,
          map: mapRef.current,
          icon: {
            content: `<div style="width:14px;height:14px;background:#4285F4;border:2px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(66,133,244,.6);"></div>`,
            anchor: new window.naver.maps.Point(7, 7),
          },
        });
      } else {
        myLocationMarkerRef.current.setPosition(p);
      }
    };

    const updateAttractionMarkers = (arr: AttractionMapSummary[]) => {
      attractionMarkersRef.current.forEach((m) => m.setMap(null));
      attractionMarkersRef.current = arr.map((a) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(a.latitude, a.longitude),
          map: mapRef.current!,
          icon: {
            url: '/assets/custom-pin.png',
            size: new window.naver.maps.Size(48, 48),
            scaledSize: new window.naver.maps.Size(40, 40),
            anchor: new window.naver.maps.Point(20, 40),
          },
        });

        marker.set('customData', a);

        // 마커 클릭 시 BottomSheet 열기
        window.naver.maps.Event.addListener(marker, 'click', () => {
          const data = marker.get('customData') as AttractionMapSummary;
          setSelectedAttraction(data);
        });

        return marker;
      });
    };

    if (document.getElementById(scriptId)) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${
        import.meta.env.VITE_NAVER_MAP_CLIENT_ID
      }&language=en`;
      script.async = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    }

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (mapRef.current) {
        (mapRef.current as naver.maps.Map & { destroy?: () => void }).destroy?.();
        mapRef.current = null;
      }
      attractionMarkersRef.current.forEach((m) => m.setMap(null));
      attractionMarkersRef.current = [];
    };
  }, []);

  const moveToMyLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setZoom(16);
      mapRef.current.setCenter(userLocation);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 58px)' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <MyLocationButton onClick={moveToMyLocation} />
      <AttractionBottomSheet
        attraction={selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
      />
    </div>
  );
}
