import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/common/MainLayout'; // ✅ 추가
import Home from '../pages/Home';
import Map from '../pages/Map';
import MyPage from '../pages/MyPage';
import SearchPage from '../pages/SearchPage';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}
