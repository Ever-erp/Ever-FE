import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reissueToken } from "../services/auth/authService";
import { useDispatch } from "react-redux";

export const useAuthFetch = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ping = async (): Promise<Response> => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch("http://localhost:8080/auth/validate", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let response = await ping();

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          // 401 → 토큰 재발급 시도
          try {
            const newAccessToken = await reissueToken(navigate, dispatch);
            const retry = await fetch("http://localhost:8080/auth/validate", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
                "Content-Type": "application/json",
              },
            });

            if (retry.status === 200) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } catch (err) {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Ping 실패", err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return { isAuthenticated };
};
