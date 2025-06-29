import React from "react";
import CustomButton from "../../common/CustomButton";

const MeetingRoomReservationBtn = ({
  setShowModal,
  myReservations,
  reservation,
  onComplete,
}) => {
  const handleCancelBtnClick = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      // 예약한 방번호와 시간 확인
      const roomNum = Number(reservation.roomNum);
      const startTime = reservation.reservationTime;

      if (!roomNum || !startTime) {
        alert("취소할 예약 정보를 확인해주세요.");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/reservation/cancel/${roomNum}/${startTime}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert("회의실 취소 실패: " + errorData.message);
        return;
      }

      const data = await response.json();
      console.log("취소 응답:", data);
      alert("회의실을 취소하였습니다.");

      await onComplete(); // ✅ 콜백 실행
    } catch (error) {
      console.error("회의실 취소 중 오류 발생:", error);
      alert("회의실 취소 중 오류가 발생했습니다.");
    }
  };

  const isMyReservation = myReservations.some((my) => {
    return (
      my.roomNum === Number(reservation.roomNum) &&
      my.startTime === reservation.reservationTime
    );
  });
  return (
    <div className="w-full flex justify-end">
      <div className="w-25 flex gap-4 mt-10">
        {isMyReservation ? (
          <CustomButton
            label="예약 취소"
            className="py-[1vh]"
            variant="outline"
            rounded="rounded-lg"
            size="md"
            onClick={handleCancelBtnClick}
          />
        ) : (
          <CustomButton
            label="예약 신청"
            className="py-[1vh]"
            variant="brand"
            rounded="rounded-lg"
            size="md"
            onClick={() => setShowModal(true)}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingRoomReservationBtn;
