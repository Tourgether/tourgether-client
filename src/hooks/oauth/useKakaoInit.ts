import { useEffect } from "react";

export function useKakaoInit() {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_LOGIN_CLIENT_ID);
      console.log("Kakao SDK 초기화 완료");
    }
  }, []);
}
