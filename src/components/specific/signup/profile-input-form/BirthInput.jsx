import React, { useRef, useState } from "react";
import CustomInputContainer from "../../../common/CustomInputContainer";
import DatePicker from "react-datepicker";
import { FaRegCalendarAlt } from "react-icons/fa";

const BirthInput = ({ birth, setBirth }) => {
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  // DatePicker ref
  const datePickerRef = useRef(null);

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
          selected={birth}
          onChange={(date) => setBirth(date)}
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
    </>
  );
};

export default BirthInput;
