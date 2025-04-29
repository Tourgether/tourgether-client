import { useEffect, useRef } from "react";

export type TabType = "All" | "Bus" | "Subway";

interface RouteFilterTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function RouteFilterTabs({ activeTab, setActiveTab }: RouteFilterTabsProps) {
  const tabs: TabType[] = ["All", "Bus", "Subway"];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const index = tabs.indexOf(activeTab);
    const currentTab = tabRefs.current[index];

    if (currentTab && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = currentTab;
      indicatorRef.current.style.left = `${offsetLeft}px`;
      indicatorRef.current.style.width = `${offsetWidth}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div style={{ position: "relative", borderBottom: "1px solid #eee", marginBottom: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          position: "relative",
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            onClick={() => setActiveTab(tab)}
            style={{
              fontWeight: tab === activeTab ? "bold" : "normal",
              color: tab === activeTab ? "#9B28FF" : "#888",
              padding: "6px 12px",
              background: "transparent",
              border: "none",
              borderRadius: "0",
              cursor: "pointer",
              transition: "color 0.2s ease",
              fontSize: "15px",
            }}
          >
            {tab}
          </button>
        ))}
        <div
          ref={indicatorRef}
          style={{
            position: "absolute",
            bottom: 0,
            height: "3px",
            background: "linear-gradient(to right, #9B28FF, #C32BAD)",
            transition: "left 0.3s ease, width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
