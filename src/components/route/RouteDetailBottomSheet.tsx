import { useRef, useState, Fragment } from "react";
import { Sheet } from "react-modal-sheet";
import { Route, SubPath } from "../../types/route";
import { FaBus, FaSubway, FaWalking } from "react-icons/fa";
import { RouteProgressBar } from "./RouteProgressBar";
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
  const { totalTime, payment, busTransitCount, subwayTransitCount } =
    route.info;

  const [open, setOpen] = useState(true);
  const sheetRef = useRef<React.ElementRef<typeof Sheet>>(null);

  const iconByType = (t: number) =>
    t === 1 ? (
      <FaSubway size={14} color="#5C9EFF" />
    ) : t === 2 ? (
      <FaBus size={14} color="#FFB200" />
    ) : (
      <FaWalking size={14} color="#A0A4A8" />
    );

  const labelBySubPath = (s: SubPath) =>
    s.trafficType === 1
      ? s.lane?.[0]?.name ?? "지하철"
      : s.trafficType === 2
      ? s.lane?.[0]?.busNo ?? "버스"
      : "도보";

  /* ── 컴포넌트 ───────────────────────────────────────── */
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

        {/* 내부 스크롤 가능 영역 */}
        <Sheet.Content disableDrag>
          <Sheet.Scroller style={{ padding: "22px 20px 32px" }}>
            {/* ── ① 상단 요약 ─────────────────────────── */}
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
              {totalTime}분
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#555" }}>
              환승{" "}
              {Number(busTransitCount || 0) + Number(subwayTransitCount || 0)}
              회&nbsp;|&nbsp;
              {payment.toLocaleString()}원
            </p>

            {/* ── ② 진행 막대 ─────────────────────────── */}
            <RouteProgressBar subPaths={route.subPath} />
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #E5E5E5",
                marginTop: 18,
              }}
            />

            {/* ── ③ 세로 타임라인 + 상세 ─────────────── */}
            <div
              style={{
                marginTop: 26,
                display: "grid",
                gridTemplateColumns: "28px 1fr" /* 아이콘 28px + 내용 */,
                columnGap: 12,
                rowGap: 22,
              }}
            >
              {/* 출발지 */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src="/assets/start-pin.png"
                  alt="출발"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <strong>{startLabel}</strong>
                <div style={{ fontSize: 12, color: "#888" }}>출발지</div>
              </div>

              {/* 경유 구간 */}
              {route.subPath.map((s, idx) => (
                <Fragment key={idx}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {iconByType(s.trafficType)}
                  </div>

                  <div>
                    <strong>{labelBySubPath(s)}</strong>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                      {s.sectionTime}분 · {s.distance ?? 0}m
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
                  alt="도착"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <strong>{destLabel}</strong>
                <div style={{ fontSize: 12, color: "#888" }}>도착지</div>
              </div>
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
