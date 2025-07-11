import { NavigateFunction } from "react-router-dom";
import { Dispatch } from "redux";
import { clearUser } from "../../store/userSlice";

export const reissueToken = async (
  navigate: NavigateFunction,
  dispatch: Dispatch
): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch("http://localhost:8080/auth/reissue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken, refreshToken }),
    });

    if (!response.ok) throw new Error("토큰 재발급 실패");

    const result: {
      data: {
        accessToken: string;
        refreshToken: string;
      };
    } = await response.json();

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      result.data;

    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return newAccessToken;
  } catch (error) {
    console.error("토큰 재발급 오류:", error);
    dispatch(clearUser()); // Redux 상태 초기화
    navigate("/login");
    throw error;
  }
};
