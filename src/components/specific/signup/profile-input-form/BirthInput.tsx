import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { FaRegCalendarAlt } from "react-icons/fa";
import {
  formatDateToLocalString,
  parseDateFromString,
} from "../../../../services/formatDateToLocalString";
import CustomInputContainer from "../../../common/CustomInputContainer";
import ReactDatePicker from "react-datepicker"; // 타입 지정을 위해 default import

interface BirthInputProps {
  birth: string;
  setBirth: (val: string) => void;
  error?: string;
}

const BirthInput = ({ birth, setBirth, error }: BirthInputProps) => {
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  // DatePicker ref
  const datePickerRef = useRef<ReactDatePicker | null>(null);

  // 아이콘 클릭 시 달력 열기 함수
  const openCalendar = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const isCalendarActive = isCalendarOpen || birth !== "";

  return (
    <>
      {/* 생일 */}
      <CustomInputContainer
        label="생일"
        isValid={isCalendarActive}
        isFocus={isCalendarOpen}
      >
        <FaRegCalendarAlt
          className={`${isCalendarActive ? "text-brand" : "text-gray-500"}`}
          onClick={openCalendar}
        />
        <DatePicker
          ref={datePickerRef} // ref 전달
          selected={parseDateFromString(birth)}
          onChange={(date) => {
            if (date) {
              setBirth(formatDateToLocalString(date));
            } else {
              setBirth(""); // 선택 해제 시 빈 문자열 초기값 설정
            }
          }}
          onCalendarOpen={() => setCalendarOpen(true)} // 달력 열림 감지
          onCalendarClose={() => setCalendarOpen(false)} // 달력 닫힘 감지
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          maxDate={new Date()}
          placeholderText="YYYY-MM-DD"
          dateFormat="yyyy-MM-dd"
          className="outline-none"
        />
      </CustomInputContainer>
      {birth === "" && error && (
        <p className="mt-1 ml-2 text-sm text-warning">{error}</p>
      )}
    </>
  );
};

export default BirthInput;
