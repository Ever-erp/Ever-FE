export const writeSchedule = async (scheduleData) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch("http://localhost:8080/api/class-schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(scheduleData), // 여기에 주입
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message || "수업 일정 작성 실패");
    }

    const data = await response.json();
    alert("수업 일정이 저장되었습니다.");

    return data;
  } catch (error) {
    console.error("수업 일정 작성 실패:", error);
    throw error;
  }
};
