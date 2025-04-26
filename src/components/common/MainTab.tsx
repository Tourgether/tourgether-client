import { NavLink } from 'react-router-dom';
import { FaHome, FaMapMarkedAlt, FaUserCircle } from 'react-icons/fa';
import '../../styles/MainTab.css';

const MainTab = () => (
  <nav className="tab-bar">
    <NavLink to="/home" className="tab-item">
      {({ isActive }) => (
        <>
          <div className={`icon ${isActive ? 'active' : ''}`}>
            <FaHome />
          </div>
          <div className={`label ${isActive ? 'active' : ''}`}>HOME</div>
        </>
      )}
    </NavLink>

    <NavLink to="/map" className="tab-item">
      {({ isActive }) => (
        <>
          <div className={`icon ${isActive ? 'active' : ''}`}>
            <FaMapMarkedAlt />
          </div>
          <div className={`label ${isActive ? 'active' : ''}`}>MAP</div>
        </>
      )}
    </NavLink>

    <NavLink to="/mypage" className="tab-item">
      {({ isActive }) => (
        <>
          <div className={`icon ${isActive ? 'active' : ''}`}>
            <FaUserCircle />
          </div>
          <div className={`label ${isActive ? 'active' : ''}`}>MY PAGE</div>
        </>
      )}
    </NavLink>
  </nav>
);

export default MainTab;
