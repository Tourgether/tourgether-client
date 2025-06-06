import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import MyLocationButton from "./MyLocationButton";
import AttractionBottomSheet from "./AttractionBottomSheet";
import {
  fetchAttractionsWithinBounds,
  AttractionMapSummary,
} from "../../api/attractionApi";
import { getNaverMapLanguageCode } from "../../utils/getLanguageId";
import "../../styles/AttractionBottomSheet.css";

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

const coordToLatLng = (c: naver.maps.Coord): naver.maps.LatLng =>
  c instanceof naver.maps.LatLng ? c : new naver.maps.LatLng(c.y, c.x);

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
  const location = useLocation() as {
    state?: { selectedAttraction?: AttractionMapSummary };
  };

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

  const waitForNaverMaps = (callback: () => void) => {
    let executed = false;
    const check = () => {
      if (window.naver && window.naver.maps && !executed) {
        executed = true;
        callback();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  };

  const handleMapIdle = useCallback(async () => {
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
      const moved = distanceMeters(
        curLL.lat(),
        curLL.lng(),
        prevLL.lat(),
        prevLL.lng()
      );
      const threshold = THRESHOLD_BY_ZOOM[Math.round(zoom)] ?? 250;

      if (zoom === lastZoomRef.current && moved < threshold) return;

      lastCenterRef.current = center;
      lastZoomRef.current = zoom;
    }

    try {
      const bounds = map.getBounds();
      if (!(bounds instanceof naver.maps.LatLngBounds)) return;

      const sw = bounds.getSW();
      const ne = bounds.getNE();

      const attractions = await fetchAttractionsWithinBounds(
        sw.lat(),
        sw.lng(),
        ne.lat(),
        ne.lng()
      );
      updateAttractionMarkers(attractions);
    } catch (error) {
      console.error("관광지 조회 실패", error);
    }
  }, []);

  const updateAttractionMarkers = (arr: AttractionMapSummary[]) => {
    attractionMarkersRef.current.forEach((m) => m.setMap(null));
    attractionMarkersRef.current = arr.map((a) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(a.latitude, a.longitude),
        map: mapRef.current!,
        icon: {
          url: "/assets/custom-pin.png",
          size: new window.naver.maps.Size(48, 48),
          scaledSize: new window.naver.maps.Size(40, 40),
          anchor: new window.naver.maps.Point(20, 40),
        },
      });

      marker.set("customData", a);

      window.naver.maps.Event.addListener(marker, "click", () => {
        const data = marker.get("customData") as AttractionMapSummary;
        setSelectedAttraction(data);
      });

      return marker;
    });
  };

  const drawOrMoveMyLocationMarker = (pos: naver.maps.LatLng) => {
    if (!mapRef.current) return;
    if (!myLocationMarkerRef.current) {
      myLocationMarkerRef.current = new window.naver.maps.Marker({
        position: pos,
        map: mapRef.current,
        icon: {
          content: `<div style="z-index:9999;width:14px;height:14px;background:#4285F4;border:2px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(66,133,244,.6);"></div>`,
          anchor: new window.naver.maps.Point(7, 7),
        },
      });
    } else {
      myLocationMarkerRef.current.setPosition(pos);
    }
  };

  const initializeMap = () => {
    if (mapRef.current || !mapContainerRef.current || !window.naver) return;

    const fallback = new window.naver.maps.LatLng(37.5665, 126.978);
    const map = new window.naver.maps.Map(mapContainerRef.current, {
      center: fallback,
      zoom: 14,
      minZoom: 12,
      maxZoom: 20,
    });

    mapRef.current = map;

    map.addListener("idle", () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(handleMapIdle, 500);
    });
  };

  const startGeolocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = new window.naver.maps.LatLng(coords.latitude, coords.longitude);
        setUserLocation(pos);
        drawOrMoveMyLocationMarker(pos);
        mapRef.current?.setCenter(pos);
      },
      (err) => {
        console.warn("❗ 위치 실패:", err);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10_000,
      }
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const pos = new window.naver.maps.LatLng(coords.latitude, coords.longitude);
        setUserLocation(pos);
        drawOrMoveMyLocationMarker(pos);
      },
      (err) => {
        console.warn("📡 위치 추적 실패", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );
  };

  useEffect(() => {
    const scriptId = "naver-map-sdk";
    const lang = getNaverMapLanguageCode();

    if (document.getElementById(scriptId)) {
      waitForNaverMaps(() => {
        initializeMap();
        startGeolocation();
      });
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}&language=${lang}`;
      script.async = true;
      script.onload = () =>
        waitForNaverMaps(() => {
          initializeMap();
          startGeolocation();
        });
      document.head.appendChild(script);
    }

    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (mapRef.current) {
        (mapRef.current as naver.maps.Map & { destroy?: () => void }).destroy?.();
        mapRef.current = null;
      }
      attractionMarkersRef.current.forEach((m) => m.setMap(null));
      attractionMarkersRef.current = [];
    };
  }, [handleMapIdle]);

  useEffect(() => {
    if (location.state?.selectedAttraction && mapRef.current) {
      const selected = location.state.selectedAttraction;
      setSelectedAttraction(selected);

      const selectedLatLng = new window.naver.maps.LatLng(
        selected.latitude,
        selected.longitude
      );
      mapRef.current.setCenter(selectedLatLng);
      mapRef.current.setZoom(16);

      handleMapIdle();
    }
  }, [location.state, handleMapIdle]);

  const moveToMyLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setCenter(userLocation);
      mapRef.current.setZoom(16);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 58px)",
      }}
    >
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      <MyLocationButton onClick={moveToMyLocation} />
      <AttractionBottomSheet
        attraction={selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
      />
    </div>
  );
}
