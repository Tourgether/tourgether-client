export function useLoginWithNaver() {
  return (): Promise<string> =>
    new Promise((resolve, reject) => {
      if (typeof window !== "undefined") {
        const clientId = import.meta.env.VITE_NAVER_LOGIN_CLIENT_ID;
        const redirectUri = encodeURIComponent(
          "http://localhost:5173/oauth/callback/naver"
        );
        const state = Math.random().toString(36).substring(2);

        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

        const popup = window.open(
          naverAuthUrl,
          "_blank",
          "width=500,height=600"
        );

        if (!popup) {
          reject(new Error("Naver 로그인 팝업을 열 수 없습니다."));
          return;
        }

        const messageHandler = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          const { accessToken } = event.data;
          if (accessToken) {
            resolve(accessToken);
            window.removeEventListener("message", messageHandler);
            popup.close();
          } else {
            reject(new Error("Naver accessToken 없음"));
          }
        };

        window.addEventListener("message", messageHandler);
      } else {
        reject(new Error("브라우저 환경이 아닙니다."));
      }
    });
}
