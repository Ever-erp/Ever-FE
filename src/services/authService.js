export const reissueToken = async (navigate) => {
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

    const result = await response.json();
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      result.data;

    console.log("재발급된 토큰: ", newAccessToken);
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return newAccessToken;
  } catch (error) {
    console.error("토큰 재발급 오류:", error);
    navigate("/login");
    throw false;
  }
};
