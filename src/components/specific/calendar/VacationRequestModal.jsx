import { useState } from "react";
import CustomButton from "../../common/CustomButton";
import DatePicker from "react-datepicker";
import { writeVacation } from "../../../services/calendar/writeVacation";
import { formatDateToLocalString } from "../../../services/formatDateToLocalString";
import { isWeekend } from "../../../services/calendar/calendarService";

const VacationRequestModal = ({ onClose, loadCalendarData }) => {
  const [selectedType, setSelectedType] = useState("");
  const [reason, setReason] = useState(""); // 휴가 사유
  const [date, setDate] = useState(null); // 날짜 상태 추가

  const leaveTypes = ["연가", "병가", "조퇴", "외출", "기타"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedType || !date || !reason) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const formattedDate = formatDateToLocalString(date); // "YYYY-MM-DD"

    // 주말 체크
    if (isWeekend(formattedDate)) {
      alert("주말에는 수업 일정을 추가할 수 없습니다.");
      return;
    }

    // 실제 서버에 보낼 JSON 객체
    const vacationJson = {
      vacationDate: formattedDate,
      vacationType: selectedType,
      vacationDesc: reason,
    };

    try {
      await writeVacation(vacationJson); // 백엔드에 저장
      await loadCalendarData(); // 최신 캘린더 일정 불러오기

      setSelectedType("");
      setReason("");
      onClose();
    } catch (err) {
      alert("휴가 신청 실패: " + err.message);
    }
  };

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-lg">
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
          <h2 className="text-2xl text-brand text-center font-semibold py-2 pb-4">
            휴가 신청
          </h2>

          {/* 휴가자 (고정) */}
          <div className="flex items-center gap-[0.5vw]">
            <div className="min-w-14 text-center text-sm text-gray-600">
              휴가자
            </div>
            <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-700 shadow-sm w-fit">
              <span className="text-gray-700 font-semibold">오창은</span>
            </div>
          </div>

          {/* 날짜 선택 */}
          <div className="flex items-center gap-[0.5vw]">
            <div className="min-w-14 text-center text-sm text-gray-600">
              날짜
            </div>
            <DatePicker
              selected={date}
              onChange={(newDate) => setDate(newDate)}
              placeholderText="YYYY-MM-DD"
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 p-2 rounded-md text-sm w-full"
            />
          </div>

          {/* 휴가 종류 버튼 */}
          <div className="flex items-center gap-[0.5vw]">
            <div className="min-w-14 text-center text-sm text-gray-600">
              종류
            </div>
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
          </div>

          {/* 휴가 사유 */}
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
