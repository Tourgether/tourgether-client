import { useRef, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Sheet } from "react-modal-sheet";
import { Route, SubPath } from "../../types/route";
import { FaBus, FaSubway, FaWalking } from "react-icons/fa";
import { RouteProgressBar } from "./RouteProgressBar";
import {
  busRouteTypeColorMap,
  subwayRouteTypeColorMap,
} from "./RouteColors";
import "../../styles/sheet-center.css";

interface Props {
  route: Route;
  startLabel: string;
  destLabel: string;
}

export default function RouteDetailBottomSheet({
  route,
  startLabel,
  destLabel,
}: Props) {
  const { t } = useTranslation();
  const { totalTime, payment, busTransitCount, subwayTransitCount } =
    route.info;

  const [open, setOpen] = useState(true);
  const sheetRef = useRef<React.ElementRef<typeof Sheet>>(null);

  const getColorByType = (s: SubPath) => {
    if (s.trafficType === 1) {
      const code = s.lane?.[0]?.subwayCode;
      return subwayRouteTypeColorMap[code!] || "#5C9EFF";
    }
    if (s.trafficType === 2) {
      const type = s.lane?.[0]?.type;
      return busRouteTypeColorMap[type!] || "#51D18E";
    }
    return "#A0A4A8";
  };

  const iconByType = (s: SubPath) => {
    const color = getColorByType(s);
    if (s.trafficType === 1) return <FaSubway size={14} color={color} />;
    if (s.trafficType === 2) return <FaBus size={14} color={color} />;
    return <FaWalking size={14} color={color} />;
  };

  const labelBySubPath = (s: SubPath) =>
    s.trafficType === 1
      ? s.lane?.[0]?.name ?? t("route.subway")
      : s.trafficType === 2
      ? s.lane?.[0]?.busNo ?? t("route.bus")
      : t("route.walk");

  return (
    <Sheet
      ref={sheetRef}
      isOpen={open}
      onClose={() => setOpen(true)}
      snapPoints={[700, 420, 160]}
      initialSnap={2}
      tweenConfig={{ ease: "easeOut", duration: 0.3 }}
      className="sheet-center"
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content disableDrag>
          <Sheet.Scroller style={{ padding: "22px 20px 32px" }}>
            {/* 상단 요약 */}
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
              {totalTime}min
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#555" }}>
              {t("route.transit")}{" "}
              {Number(busTransitCount || 0) + Number(subwayTransitCount || 0)}
              {t("route.times")}&nbsp;|&nbsp;
              {payment.toLocaleString()}₩
            </p>

            {/* 진행 바 */}
            <RouteProgressBar subPaths={route.subPath} />

            <hr
              style={{
                border: "none",
                borderTop: "1px solid #E5E5E5",
                marginTop: 18,
              }}
            />

            {/* 상세 타임라인 */}
            <div
              style={{
                marginTop: 26,
                display: "grid",
                gridTemplateColumns: "28px 1fr",
                columnGap: 12,
                rowGap: 22,
              }}
            >
              {/* 출발지 */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src="/assets/start-pin.png"
                  alt={t("route.departure")}
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <strong>{startLabel}</strong>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {t("route.departure")}
                </div>
              </div>

              {/* 경유 구간 */}
              {route.subPath.map((s, idx) => (
                <Fragment key={idx}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {iconByType(s)}
                  </div>

                  <div>
                    <strong>{labelBySubPath(s)}</strong>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                      {s.sectionTime}min · {s.distance ?? 0}m
                    </div>

                    {s.passStopList?.stations?.length && (
                      <ul style={{ paddingLeft: 16, margin: "6px 0 0" }}>
                        {s.passStopList.stations.map((st) => (
                          <li
                            key={st.stationID}
                            style={{
                              fontSize: 12,
                              color: "#555",
                              lineHeight: 1.35,
                            }}
                          >
                            {st.stationName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Fragment>
              ))}

              {/* 도착지 */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src="/assets/end-pin.png"
                  alt={t("route.arrival")}
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <strong>{destLabel}</strong>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {t("route.arrival")}
                </div>
              </div>
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
