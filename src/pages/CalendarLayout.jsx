import React from "react";
import Calander from "./Calendar";

const CalendarLayout = () => {
  return (
    <div className="flex w-full h-full gap-4">
      {/* 일정표 */}
      <div className="flex-[5] p-4 bg-white rounded-xl justify-center items-center">
        <Calander />
      </div>

      {/* Right (2 parts) */}
      <div className="flex-[2] flex flex-col gap-4 ">
        {/* Top of Right (5 parts out of 7 total height) */}
        <div className="flex-[5] p-4 bg-white rounded-xl">Right Top (5)</div>

        {/* Bottom of Right (2 parts out of 7 total height) */}
        <div className="flex-[2] bg-white rounded-xl">Right Bottom (5)</div>
      </div>
    </div>
  );
};

export default CalendarLayout;
