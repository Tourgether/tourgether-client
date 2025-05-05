import { useLocation } from "react-router-dom";
import LanguagePage from "./LanguagePage";

// 리렌더링 강제 유도
export default function LanguagePageWrapper() {
  const location = useLocation();
  return <LanguagePage key={location.key} />;
}
