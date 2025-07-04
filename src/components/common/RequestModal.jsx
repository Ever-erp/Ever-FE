import React, { useState } from "react";

const VacationRequestModal = () => {
  const [selectedType, setSelectedType] = useState("");
  const [reason, setReason] = useState("");

  const leaveTypes = ["연가", "병가", "기타", "조퇴", "외출"];

  const handleSubmit = () => {
    if (!selectedType || !reason.trim()) {
      alert("휴가 종류와 사유를 모두 입력하세요.");
      return;
    }

    // console.log("제출:", { type: selectedType, reason });
    alert("휴가 신청이 저장되었습니다!");
    setSelectedType("");
    setReason("");
  };

  return (
    <div className="w-[380px] p-5 bg-white rounded-lg shadow-lg flex flex-col gap-4">
      <h2 className="text-[20px] text-[#002c5f] text-center font-semibold">
        휴가 신청
      </h2>

      <div className="flex flex-wrap gap-2 justify-center">
        {leaveTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-2 rounded-md text-sm border transition 
              ${
                selectedType === type
                  ? "bg-[#002c5f] text-white border-[#002c5f]"
                  : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      <textarea
        placeholder="휴가 사유를 입력하세요"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full h-20 p-2 rounded-md border border-gray-300 resize-none text-sm"
      />

      <button
        onClick={handleSubmit}
        className="py-2 bg-[#002c5f] text-white text-base rounded-md hover:bg-[#001a3d] transition"
      >
        저장
      </button>
    </div>
  );
};

export default VacationRequestModal;
