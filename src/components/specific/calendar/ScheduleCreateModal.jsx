import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomButton from "../../common/CustomButton";
import { writeSchedule } from "../../../services/calendar/writeClassSchedule";
import { formatDateToLocalString } from "../../../services/formatDateToLocalString";

const ScheduleCreateModal = ({ onSubmit, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");

  const datePickerRef1 = useRef(null);
  const datePickerRef2 = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !startDate || !endDate) {
      alert("제목과 날짜를 입력해주세요.");
      return;
    }

    // full calendar는 종료날짜 포함 안하므로 +1일 추가
    const endDateInclusive = new Date(endDate);
    endDateInclusive.setDate(endDateInclusive.getDate() + 1);

    // 일정 이벤트 객체 생성(이벤트 생성 시에는 완료 날짜 +1)
    const newEvent = {
      title: `${title}`,
      start: formatDateToLocalString(startDate),
      end: formatDateToLocalString(endDateInclusive),
      color: "#A2D2DF", // 수업 일정 색상
      display: "block",
      customOrder: 2, // 수업 일정은 customOrder 2
    };

    // 백엔드와 통신 시에는 원래 완료 날짜
    const scheduleJson = {
      subjectName: title,
      startDate: newEvent.start,
      endDate: formatDateToLocalString(endDate),
      classDesc: description,
      classUrl: material,
    };

    try {
      const success = onSubmit(newEvent); // 캘린더에만 추가
      if (success) {
        await writeSchedule(scheduleJson); // 서버 저장

        alert("수업 일정이 저장되었습니다.");
        setTitle("");
        setDescription("");
        setMaterial("");
        onClose();
      }
    } catch (err) {
      alert("수업 일정 작성 실패: " + err.message);
    }
  };

  return (
    <div className="relative p-8 bg-white rounded-lg shadow-lg">
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
            수업 일정 추가
          </h2>

          {/* 일정 제목 입력 */}
          <div className="flex items-center gap-[0.5vw]">
            <div className="min-w-14 text-center text-sm text-gray-600">
              수업 이름
            </div>
            <input
              type="text"
              placeholder="일정 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* 수업 자료 입력 */}
          <div className="flex items-center gap-[0.5vw]">
            <div className="min-w-14 text-center text-sm text-gray-600">
              수업 자료
            </div>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="자료 링크 또는 간단한 설명"
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* 수업 일정 시작 날짜 */}
          <div className="flex items-center justify-between gap-3">
            <div className="w-1/2">
              <label className="text-sm text-gray-600 mb-1 block">
                시작 날짜
              </label>
              <DatePicker
                ref={datePickerRef1}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="YYYY-MM-DD"
                dateFormat="yyyy-MM-dd"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>

            {/* 수업 일정 끝 날짜 */}
            <div className="w-1/2">
              <label className="text-sm text-gray-600 mb-1 block">
                종료 날짜
              </label>
              <DatePicker
                ref={datePickerRef2}
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="YYYY-MM-DD"
                dateFormat="yyyy-MM-dd"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
          </div>

          {/* 수업 설명 */}
          <textarea
            placeholder="설명을 입력하세요 (선택)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-24 p-2 rounded-md border border-gray-300 resize-none text-sm"
          />

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

export default ScheduleCreateModal;
