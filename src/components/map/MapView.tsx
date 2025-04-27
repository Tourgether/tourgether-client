import { useEffect, useRef, useState } from 'react';
import MyLocationButton from './MyLocationButton';
import {
  fetchAttractionsWithinBounds,
  AttractionMapSummary,
} from '../../api/attractionApi';

/* ---------------- 하버사인 ---------------- */
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

/* ---------------- Coord → LatLng --------- */ // ✨
const coordToLatLng = (c: naver.maps.Coord): naver.maps.LatLng =>
  c instanceof naver.maps.LatLng ? c : new naver.maps.LatLng(c.y, c.x);

/* ---------------- 줌별 임계값 ------------- */
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
  /* -------- Refs -------- */
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const myLocationMarkerRef = useRef<naver.maps.Marker | null>(null);
  const attractionMarkersRef = useRef<naver.maps.Marker[]>([]);
  const lastCenterRef = useRef<naver.maps.Coord | null>(null);        // ✨
  const lastZoomRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const debounceTimerRef = useRef<number | undefined>(undefined);

  /* -------- State -------- */
  const [userLocation, setUserLocation] = useState<naver.maps.LatLng | null>(
    null,
  );

  /* -------- effect -------- */
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
            const pos = new window.naver.maps.LatLng(
              coords.latitude,
              coords.longitude,
            );
            map.setCenter(pos);
            setUserLocation(pos);
            drawOrMoveMyLocationMarker(pos);
          },
          console.error,
          { enableHighAccuracy: true, timeout: 8000 },
        );

        watchIdRef.current = navigator.geolocation.watchPosition(
          ({ coords }) => {
            const pos = new window.naver.maps.LatLng(
              coords.latitude,
              coords.longitude,
            );
            setUserLocation(pos);
            drawOrMoveMyLocationMarker(pos);
          },
          console.error,
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
        );
      }
    };

    /* ----- idle handler ----- */
    const handleMapIdle = async () => {
      if (!mapRef.current) return;

      const map = mapRef.current;
      const zoom = map.getZoom();
      const center = map.getCenter();           // Coord
      const prev = lastCenterRef.current;       // Coord | null

      if (!prev) {
        lastCenterRef.current = center;
        lastZoomRef.current = zoom;
      } else {
        const curLL = coordToLatLng(center);    // ✨
        const prevLL = coordToLatLng(prev);     // ✨
        const moved = distanceMeters(
          curLL.lat(), curLL.lng(), prevLL.lat(), prevLL.lng(),
        );
        const threshold =
          THRESHOLD_BY_ZOOM[Math.round(zoom)] ?? 250;
        if (zoom === lastZoomRef.current && moved < threshold) return;

        lastCenterRef.current = center;
        lastZoomRef.current = zoom;
      }

      try {
        const b = map.getBounds() as naver.maps.LatLngBounds;
        const sw = b.getSW();
        const ne = b.getNE();

        const list = await fetchAttractionsWithinBounds(
          sw.lat(), sw.lng(), ne.lat(), ne.lng(),
        );
        updateAttractionMarkers(list);
      } catch (e) {
        console.error('관광지 조회 실패', e);
      }
    };

    /* ----- 마커 그리기 ----- */
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
        return new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(a.latitude, a.longitude),
          map: mapRef.current!,
          icon: {
            url: '/assets/custom-pin.png',
            size: new window.naver.maps.Size(48, 48),
            scaledSize: new window.naver.maps.Size(40, 40),
            anchor: new window.naver.maps.Point(20, 40),
          },
        });
      });
    };

    /* ----- 스크립트 로드 ----- */
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

    /* ----- cleanup ----- */
    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
      if (debounceTimerRef.current)
        clearTimeout(debounceTimerRef.current);
      if (mapRef.current) {
        (mapRef.current as naver.maps.Map & { destroy?: () => void }).destroy?.();
        mapRef.current = null;
      }
      attractionMarkersRef.current.forEach((m) => m.setMap(null));
      attractionMarkersRef.current = [];
    };
  }, []);

  /* 내 위치 이동 */
  const moveToMyLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setZoom(16);
      mapRef.current.setCenter(userLocation);
    }
  };

  /* render */
  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 58px)' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <MyLocationButton onClick={moveToMyLocation} />
    </div>
  );
}
