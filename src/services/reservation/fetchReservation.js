export const fetchReservation = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch("http://localhost:8080/reservation/status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "예약 시간 조회 실패");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("예약 시간 조회 실패:", err);
    throw err; // 호출한 쪽에서 try-catch
  }
};
