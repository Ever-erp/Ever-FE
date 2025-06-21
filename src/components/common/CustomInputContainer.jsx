import React from "react";

const CustomInputContainer = ({ label, children, isValid, isFocus }) => {
  return (
    <div className="relative w-full max-w-xl mt-6">
      {/* 라벨 */}
      <label
        className={`absolute left-2 -top-3 px-1 text-sm transition-all bg-white 
          ${isValid ? "text-brand" : " text-gray-400"}
          ${isFocus ? "font-medium" : ""}`}
      >
        {label}
      </label>
      {/* 자식을 담는 컨테이너 */}
      {/* focus시 선 굵기*/}
      <div
        className={`w-full flex items-center border 
          ${isValid ? "border-brand" : "border-gray-300"} 
          ${isFocus ? "ring-1 ring-brand transition duration-100" : ""}
          rounded-lg px-4 py-3 gap-2 cursor-pointer`}
      >
        {children}
      </div>
    </div>
  );
};

export default CustomInputContainer;
