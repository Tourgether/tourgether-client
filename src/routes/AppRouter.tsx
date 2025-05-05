// src/routes/AppRouter.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import PrivateRoutes from "./PrivateRoutes";
import Quiz from "../pages/Quiz";
import LanguagePageWrapper from "../pages/LanguagePageWrapper";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          {/* 로그인 없이 접근 가능한 경로 */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/oauth/callback/naver" element={<NaverCallback />} />
          <Route path="/language" element={<LanguagePageWrapper />} />

          {/* 로그인 필요 경로 */}
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/attraction/:id" element={<AttractionDetailPage />} />
            <Route path="/route" element={<RoutePage />} />
            <Route path="/route-detail" element={<RouteDetailPage />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/mypage/Language" element={<LanguagePage />} />
            <Route path="/mypage/liked" element={<LikedPage />} />
            <Route path="/mypage/visits" element={<VisitHistoryPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
