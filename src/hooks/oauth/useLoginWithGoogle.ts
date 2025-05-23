// src/hooks/useLoginWithGoogle.ts
import { useGoogleLogin } from "@react-oauth/google";
import { useRef } from "react";

export function useLoginWithGoogle(): () => Promise<string> {
  const promiseRef = useRef<{
    resolve: (token: string) => void;
    reject: (err: Error) => void;
  } | null>(null);

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    scope: "profile",
    onSuccess: (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      if (accessToken && promiseRef.current) {
        promiseRef.current.resolve(accessToken);
        promiseRef.current = null;
      }
    },
    onError: (_) => {
      if (promiseRef.current) {
        promiseRef.current.reject(new Error("Google login failed"));
        promiseRef.current = null;
      }
    },
  });

  const loginWithGoogle = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      promiseRef.current = { resolve, reject };
      googleLogin();
    });
  };

  return loginWithGoogle;
}
