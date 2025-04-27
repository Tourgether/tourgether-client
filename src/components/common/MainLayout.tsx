import { Outlet } from 'react-router-dom';
import MainTab from './MainTab';
import '../../styles/MainLayout.css';

export default function MainLayout() {
  return (
    <>
      <div className="content">
        <Outlet />
      </div>
      <MainTab />
    </>
  );
}
