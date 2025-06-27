export const deleteVacation = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `http://localhost:8080/api/vacation-schedules/${id}`,
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
      throw new Error(errorData.message || "휴가 삭제 실패");
    }

    const data = await response.json();
    alert("휴가 일정이 삭제되었습니다.");

    return data;
  } catch (error) {
    console.error("휴가 일정 삭제 실패:", err);
    throw err;
  }
};
