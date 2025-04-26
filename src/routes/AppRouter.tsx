import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Map from "../pages/Map";
import MyPage from "../pages/MyPage";
import SearchPage from "../pages/SearchPage";
import MainTab from "../components/common/MainTab";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <MainTab />
    </Router>
  );
}
