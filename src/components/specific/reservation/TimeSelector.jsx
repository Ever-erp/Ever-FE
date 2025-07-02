import React, { useState } from "react";
import CustomButton from "../../common/CustomButton";
import { formatHour } from "../../../services/formatHour";
import { FaCheck } from "react-icons/fa";

const TimeSelector = ({
  reservation,
  updateReservation,
  reservedTimes = [],
  myReservations = [],
}) => {
  const [period, setPeriod] = useState("am"); // "am" 또는 "pm"

  // 오전: 8~11, 오후: 12~20
  const timeRange = {
    am: Array.from({ length: 4 }, (_, i) => i + 8), // [8, 9, 10, 11]
    pm: Array.from({ length: 9 }, (_, i) => i + 12), // [12 ~ 20]
  };

  const handleTimeClick = (hour) => {
    updateReservation("reservationTime", hour);
  };

  return (
    <div className="w-full">
      {/* 오전/오후 버튼 */}
      <div className="flex gap-[1vw] mb-[1vw]">
        <CustomButton
          label="오전"
          className="py-[1vh]"
          variant="outline"
          rounded="rounded-full"
          selected={period === "am"}
          onClick={() => {
            setPeriod("am");
            updateReservation("reservationTime", null);
          }}
        />
        <CustomButton
          label="오후"
          className="py-[1vh]"
          variant="outline"
          rounded="rounded-full"
          selected={period === "pm"}
          onClick={() => {
            setPeriod("pm");
            updateReservation("reservationTime", null);
          }}
        />
      </div>

      <hr className="border-gray-300 mb-[1vw]" />

      {/* 시간 버튼 목록 */}
      <div className="flex flex-col gap-[0.5vw] min-h-[46vh]">
        {timeRange[period].map((hour) => {
          const isReserved = reservedTimes.includes(hour); // 이미 예약한 시간
          const isMyReservation = myReservations.some(
            (my) =>
              String(my.roomNum) === reservation.roomNum && // 내가 이미 예약한 방번호와 출력할 방번호
              my.startTime === hour // 내가 이미 예약한 시간과 출력할 시간
          );
          // 순서 중요: 내 예약이면 강조(positive) + 비활성화 안 함
          const variant = isMyReservation
            ? "positive"
            : isReserved
            ? "outlineDisabled"
            : "outline";

          return (
            <CustomButton
              key={hour}
              label={
                isMyReservation ? (
                  <>
                    <FaCheck className="pt-1 mr-1 text-brand" />
                    <span className="font-bold">{formatHour(hour)}</span>
                  </>
                ) : (
                  <span>{formatHour(hour)}</span>
                )
              }
              className="py-[1vh] flex justify-center items-center"
              variant={variant}
              rounded="rounded-full"
              selected={reservation.reservationTime === hour}
              onClick={() => handleTimeClick(hour)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TimeSelector;
