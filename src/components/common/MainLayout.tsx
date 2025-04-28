import { Outlet, useLocation } from "react-router-dom";
import MainTab from "./MainTab";
import "../../styles/MainLayout.css";

export default function MainLayout() {
  const location = useLocation();

  // MainTab 제외 경로
  const excludePaths = ["/", "/intro"];
  const showMainTab = !excludePaths.includes(location.pathname);

  return (
    <>
      <div className="content">
        <Outlet />
      </div>
      {showMainTab && <MainTab />}
    </>
  );
}
