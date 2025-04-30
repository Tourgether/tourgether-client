import { useEffect } from "react";

export default function NaverCallback() {
  useEffect(() => {
    if (window.opener) {
      const hash = window.location.hash;
      if (hash.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");

        window.opener.postMessage({ accessToken }, window.location.origin);

        setTimeout(() => {
          window.close();
        }, 300);
      }
    }
  }, []);

  return <div>네이버 로그인 중입니다...</div>;
}
