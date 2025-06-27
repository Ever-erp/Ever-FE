import React from "react";

const NoticeColor = () => {
  return (
    <div className="w-full flex justify-end">
      <div>
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 bg-positive rounded-sm"></div>
          <span className="text-gray-700 text-sm">내가 예약한 회의실</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 bg-negative rounded-sm"></div>
          <span className="text-gray-700 text-sm">회의실 만석</span>
        </div>
      </div>
    </div>
  );
};

export default NoticeColor;
