import { NavLink } from "react-router-dom";
import { FaHome, FaMapMarkedAlt, FaUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../../styles/MainTab.css";

const MainTab = () => {
  const { t } = useTranslation();

  return (
    <nav className="tab-bar">
      <NavLink to="/home" className="tab-item">
        {({ isActive }) => (
          <>
            <div className={`icon ${isActive ? "active" : ""}`}>
              <FaHome />
            </div>
            <div className={`label ${isActive ? "active" : ""}`}>
              {t("tab.home")}
            </div>
          </>
        )}
      </NavLink>

      <NavLink to="/map" className="tab-item">
        {({ isActive }) => (
          <>
            <div className={`icon ${isActive ? "active" : ""}`}>
              <FaMapMarkedAlt />
            </div>
            <div className={`label ${isActive ? "active" : ""}`}>
              {t("tab.map")}
            </div>
          </>
        )}
      </NavLink>

      <NavLink to="/mypage" className="tab-item">
        {({ isActive }) => (
          <>
            <div className={`icon ${isActive ? "active" : ""}`}>
              <FaUserCircle />
            </div>
            <div className={`label ${isActive ? "active" : ""}`}>
              {t("tab.mypage")}
            </div>
          </>
        )}
      </NavLink>
    </nav>
  );
};

export default MainTab;
