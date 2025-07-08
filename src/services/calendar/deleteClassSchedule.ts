export const deleteSchedule = async (id: number): Promise<void> => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `http://localhost:8080/api/class-schedules/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "수업 일정 삭제 실패");
    }

    alert("수업 일정이 삭제되었습니다.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("수업 일정 삭제 실패:", error.message);
      throw error;
    } else {
      console.error("수업 일정 삭제 실패: 알 수 없는 오류");
      throw new Error("알 수 없는 오류");
    }
  }
};
