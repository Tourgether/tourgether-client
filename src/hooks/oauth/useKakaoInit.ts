import { useEffect } from "react";

export function useKakaoInit() {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("7c64efff56ae75e3b09318e85644bc9f");
      console.log("Kakao SDK 초기화 완료");
    }
  }, []);
}
