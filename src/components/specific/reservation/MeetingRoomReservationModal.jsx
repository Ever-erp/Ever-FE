import React, { useState } from "react";
import CustomInput from "../../common/CustomInput";
import CustomButton from "../../common/CustomButton";
import { fetchWithAuth } from "../../../services/apiClient";
import { formatHour } from "../../../services/formatHour";

const MeetingRoomReservationModal = ({
  reservation,
  updateReservation,
  reservedTimes = [],
  onClose,
  onComplete,
}) => {
  const handleChange = (field, value) => {
    updateReservation(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { roomNum, reservationTime, headCount, reservationDesc } =
      reservation;

    // 1. 기본 입력값 확인
    if (!headCount.trim() || !reservationDesc.trim()) {
      alert("예약 인원과 사유를 모두 입력하세요.");
      return;
    }

    const headCountNum = Number(headCount);
    if (isNaN(headCountNum) || headCountNum < 1 || headCountNum > 10) {
      alert("예약 인원은 1명 이상 10명 이하로 입력해주세요.");
      return;
    }

    // 2. 시간 및 방 번호 유효성 검사
    if (
      reservationTime === null ||
      reservationTime < 8 ||
      reservationTime > 20
    ) {
      alert("유효하지 않은 예약 시간입니다. 다시 선택해주세요.");
      return;
    }

    if (!roomNum) {
      alert("회의실이 선택되지 않았습니다.");
      return;
    }

    // 3. 예약된 시간 중복 확인
    if (reservedTimes.includes(reservationTime)) {
      alert("이미 예약된 시간입니다. 다른 시간을 선택해주세요.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        "http://localhost:8080/reservation/reserve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roomNum: roomNum,
            startTime: reservationTime,
            headCount: headCount,
            reservationDesc: reservationDesc,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert("회의실 예약 실패: " + errorData.message);
        return;
      }

      const res = await response.json();

      alert("회의실 예약이 저장되었습니다!");

      if (onComplete) {
        await onComplete(); // ✅ 예약 완료 후 콜백 호출
      }
    } catch (error) {
      console.error(error);
      alert("회의실 예약 중 오류가 발생했습니다.");
    }

    onClose(); // 저장 후 모달 닫기
  };

  return (
    <div className="relative w-[20vw] min-w-[380px] p-5 bg-white rounded-lg shadow-lg">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        aria-label="Close modal"
      >
        &times;
      </button>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 ">
          <h2 className="text-2xl text-brand text-center font-semibold py-2">
            회의실 예약
          </h2>

          {/* 예약 정보 (props로 받은 값 표시) */}
          <div className="text-gray-400 text-sm space-y-1">
            <div className="w-full flex items-center gap-[1vw]">
              <div className="min-w-14 text-center">날짜</div>
              <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-700 shadow-sm w-fit">
                <span className="text-gray-700 font-semibold">
                  {new Date().toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-[1vw]">
              <div className="min-w-14 text-center">회의실</div>
              <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-700 shadow-sm w-fit">
                <span className="text-gray-700  font-semibold">
                  회의실{" " + reservation.roomNum}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-[1vw]">
              <div className="min-w-14 text-center">예약 시간</div>
              <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-700 shadow-sm w-fit">
                <span className="text-gray-700  font-semibold">
                  {" "}
                  {reservation.reservationTime !== null
                    ? `${formatHour(
                        reservation.reservationTime
                      )} ~ ${formatHour(reservation.reservationTime + 1)}`
                    : "시간 미선택"}
                </span>
              </div>
            </div>
            <div>
              {/* 예약 인원 입력 */}
              <CustomInput
                label="예약 인원"
                placeholder="예) 3"
                value={reservation.headCount}
                type="number" // ✅ 숫자만 입력되도록 설정
                min={1} // 최소값
                max={10} // 최대값
                onChange={(val) => handleChange("headCount", val)}
              />

              {/* 예약 인원 입력 */}
              <CustomInput
                label="예약 사유"
                placeholder="예약 사유를 입력하세요"
                value={reservation.reservationDesc}
                onChange={(val) => handleChange("reservationDesc", val)}
              />
            </div>
          </div>

          {/* 저장 버튼 */}
          <CustomButton
            label="저장"
            className="py-[1vh] rounded-lg"
            variant="brand"
            size="md"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default MeetingRoomReservationModal;
