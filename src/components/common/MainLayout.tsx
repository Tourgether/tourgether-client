import { Outlet, useLocation } from "react-router-dom";
import MainTab from "./MainTab";
import "../../styles/MainLayout.css";

export default function MainLayout() {
  const location = useLocation();

  const excludePaths = ["/", "/intro", "/route", "/route-detail", "/language"];
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
