import { useEffect } from "react";

export function useNaverInit() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.naver) {
      window.naver_id_login = new window.naver.LoginWithNaverId({
        clientId: import.meta.env.VITE_NAVER_LOGIN_CLIENT_ID,
        // local 환경
        callbackUrl: "http://localhost:5173/oauth/callback/naver",
        isPopup: true,
      });
      window.naver_id_login.init();
      console.log("Naver SDK 초기화 완료");
    }
  }, []);
}
