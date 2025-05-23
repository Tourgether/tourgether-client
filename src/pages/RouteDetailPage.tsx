import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Route } from "../types/route";
import { fetchRouteLane } from "../api/routeApi";
import { ColoredPolylineSection } from "../types/routeDetail";
import RoutePolylineMapView from "../components/route/RoutePolylineMapView";
import { convertToColoredSections } from "../utils/convertToColoredSections";
import { FaArrowLeft } from "react-icons/fa";
import { MdRecordVoiceOver } from "react-icons/md";
import RouteDetailBottomSheet from "../components/route/RouteDetailBottomSheet";
import DocentTooltip from "../components/route/DocentTootip";
import ArrivalOverlay from "../components/route/ArrivalOverlay";
import { getLanguageId } from "../utils/getLanguageId";

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
      destName: string;
      id: string;
      attractionId: number;
    };
  };

  const navigate = useNavigate();
  const { route, start, end, destName, id, attractionId } = location.state;
  const mapObj = route.info.mapObj;

  const [sections, setSections] = useState<ColoredPolylineSection[]>([]);
  const [docentOpen, setDocentOpen] = useState(false);
  const [arrived, setArrived] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (!mapObj) return;
    const lang = getLanguageId();
    fetchRouteLane(mapObj, lang - 1).then((lanes) => {
      const colored = convertToColoredSections(lanes);
      setSections(colored);
    });
  }, [mapObj]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* 지도 */}
      <RoutePolylineMapView sections={sections} start={start} end={end} />

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 52,
          left: 16,
          zIndex: 1000,
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "999px",
          padding: "8px 10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaArrowLeft size={16} color="#333" />
      </button>

      {/* 도슨트 버튼 */}
      <div style={{ position: "absolute", top: 52, right: 16, zIndex: 1000 }}>
        <button
          onClick={() => setDocentOpen(!docentOpen)}
          style={{
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "999px",
            padding: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MdRecordVoiceOver size={24} color="#9B28FF" />
        </button>

        <DocentTooltip visible={docentOpen} language="ko" translationId={id} name={destName} />
      </div>

      {/* 📍 도착 버튼 */}
      {!arrived && (
        <button
          onClick={() => setArrived(true)}
          style={{
            position: "absolute",
            bottom: 180,
            right: 16,
            zIndex: 1000,
            background: "linear-gradient(#7B2CBF, #9B28FF)",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "999px",
            fontWeight: "bold",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            fontSize: "14px",
          }}
        >
          {t("arrival.buttonLabel")}
        </button>
      )}

      {/* 도착 오버레이 */}
      {arrived && (
        <ArrivalOverlay
          visible={true}
          destinationName={destName}
          translationId={id}
          attractionId={attractionId}
          onCancel={() => setArrived(false)}
        />
      )}

      {/* 바텀시트 - 도착했을 땐 숨김 */}
      {!arrived && (
        <RouteDetailBottomSheet
          route={route}
          startLabel="My Location"
          destLabel={destName}
        />
      )}
    </div>
  );
}
