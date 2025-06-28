export const fetchAllCalendar = async (year, month) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `http://localhost:8080/api/calendar?year=${year}&month=${month}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "휴가 작성 실패");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("휴가 작성 실패:", error);
    throw error;
  }
};
