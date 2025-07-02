export const writeVacation = async (vacationData) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      "http://localhost:8080/api/vacation-schedules",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(vacationData), // 여기에 주입
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "휴가 작성 실패");
    }

    const data = await response.json();
    alert("휴가를 등록하였습니다.");
    return data;
  } catch (error) {
    console.error("휴가 작성 실패:", error);
    throw error;
  }
};
