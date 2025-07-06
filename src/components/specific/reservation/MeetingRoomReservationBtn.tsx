import React from "react";
import CustomButton from "../../common/CustomButton";
import { MyReservation, ReservationInfo } from "../../../types/reservation";

interface MeetingRoomReservationBtnProps {
  setShowModal: (value: boolean) => void;
  myReservations: MyReservation[];
  reservation: ReservationInfo;
  onComplete: () => Promise<void> | void;
}

const MeetingRoomReservationBtn = ({
  setShowModal,
  myReservations,
  reservation,
  onComplete,
}: MeetingRoomReservationBtnProps) => {
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

      const confirm = window.confirm("정말 회의실 예약을 취소하시겠습니까?");
      if (!confirm) return;

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

      alert("회의실을 취소하였습니다.");
      await onComplete(); // 버튼 클릭 상태 초기화 및 db 로드
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
            onClick={handleCancelBtnClick}
          />
        ) : (
          <CustomButton
            label="예약 신청"
            className="py-[1vh]"
            variant="brand"
            rounded="rounded-lg"
            onClick={() => setShowModal(true)}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingRoomReservationBtn;
