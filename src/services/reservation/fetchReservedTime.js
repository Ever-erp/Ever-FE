export const fetchReservedTimes = async (roomNum) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await fetch(
      "http://localhost:8080/reservation/room/times",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ roomNum }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "예약 시간 조회 실패");
    }

    const data = await response.json();
    return data.data.reservedTimes;
  } catch (err) {
    console.error("예약 시간 조회 실패:", err);
    throw err; // 호출한 쪽에서 try-catch
  }
};
