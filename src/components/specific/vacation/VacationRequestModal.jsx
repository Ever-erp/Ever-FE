import { useState } from "react";
import CustomButton from "../../common/CustomButton";

const VacationRequestModal = ({ selectedDate, onClose }) => {
  const [selectedType, setSelectedType] = useState("");
  const [reason, setReason] = useState("");

  const leaveTypes = ["연가", "병가", "조퇴", "외출", "기타"];

  const handleSubmit = () => {
    if (!selectedType || !reason.trim()) {
      alert("휴가 종류와 사유를 모두 입력하세요.");
      return;
    }

    alert("휴가 신청이 저장되었습니다!");
    setSelectedType("");
    setReason("");
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
            휴가 신청
          </h2>

          <div className="flex flex-wrap gap-2 justify-center">
            {leaveTypes.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-2 rounded-md text-sm border transition 
              ${
                selectedType === type
                  ? "bg-brand text-white border-brand"
                  : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
              }`}
              >
                {type}
              </button>
            ))}
          </div>

          {selectedType && (
            <div className="text-gray-400 text-sm space-y-1">
              <div className="flex items-center gap-[1vw]">
                <div className="min-w-14 text-center">날짜</div>
                <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-700 shadow-sm w-fit">
                  <span className="text-gray-700 font-semibold">
                    {selectedDate}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-[1vw]">
                <div className="min-w-14 text-center">휴가자</div>
                <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-700 shadow-sm w-fit">
                  <span className="text-gray-700 font-semibold">오창은</span>
                </div>
              </div>
            </div>
          )}

          <textarea
            placeholder="휴가 사유를 입력하세요"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-32 p-2 rounded-md border border-gray-300 resize-none text-sm"
          />

          {/* 저장 버튼 */}
          <CustomButton
            label="신청"
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

export default VacationRequestModal;
