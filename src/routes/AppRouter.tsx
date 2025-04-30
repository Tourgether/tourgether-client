import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../components/common/MainLayout";
import Intro from "../pages/Intro";
import NaverCallback from "../pages/NaverCallback";
import Home from "../pages/Home";
import Map from "../pages/Map";
import MyPage from "../pages/MyPage";
import SearchPage from "../pages/SearchPage";
import AttractionDetailPage from "../pages/AttractionDetailPage";
import RoutePage from "../pages/RoutePage";
import RouteDetailPage from "../pages/RouteDetailPage";
import LikedPage from "../pages/LikedPage";
import VisitHistoryPage from "../pages/VisitHistoryPage";
import LanguagePage from "../pages/LanguagePage";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Intro />} />
          <Route path="/oauth/callback/naver" element={<NaverCallback />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/attraction/:id" element={<AttractionDetailPage />} />
          <Route path="/route" element={<RoutePage />} />
          <Route path="/route-detail" element={<RouteDetailPage />} />
          <Route path="/mypage/Language" element={<LanguagePage />} />
          <Route path="/mypage/liked" element={<LikedPage />} />
          <Route path="/mypage/visits" element={<VisitHistoryPage />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}
