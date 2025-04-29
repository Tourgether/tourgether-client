export function useLoginWithKakao() {
  return (): Promise<string> =>
    new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && window.Kakao?.Auth) {
        window.Kakao.Auth.login({
          scope: "profile_nickname, profile_image",
          success: (authObj: any) => resolve(authObj.access_token),
          fail: (err: any) => reject(err),
        });
      } else {
        reject(new Error("Kakao SDK가 로드되지 않았습니다."));
      }
    });
}
