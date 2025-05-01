import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAccessToken } from "../utils/tokenStorage";
import api from "../api/core/axios";

export default function PrivateRoutes() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkToken() {
      const token = await getAccessToken();
      if (!token) {
        setAuthorized(false);
        return;
      }

      try {
        await api.get("/api/v1/auth/me");
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      }
    }

    checkToken();
  }, []);

  if (authorized === null) return null; // 또는 로딩 스피너

  return authorized ? <Outlet /> : <Navigate to="/intro" replace />;
}
