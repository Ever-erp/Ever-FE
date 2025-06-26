import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar.css";
import VacationRequestModal from "../components/specific/vacation/VacationRequestModal";
import CustomButton from "../components/common/CustomButton";

const Calander = () => {
  const [showModal, setShowModal] = useState(false); // 휴가 신청 모달창
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
  const [selectedEl, setSelectedEl] = useState(null); // 이전 선택 셀

  const [events, setEvents] = useState([
    {
      // 공지사항은 하루 단위, end 없음
      title: "Event 1",
      start: "2025-06-01",
      color: "#A594F9",
      display: "block",
      customOrder: 1,
    },
    {
      title: "Event 2",
      start: "2025-06-01",
      end: "2025-06-05",
      color: "#A2D2DF",
      display: "block",
      customOrder: 2,
    },
    {
      // 휴가 신청은 하루 단위, end 없음
      title: "Event 2",
      start: "2025-06-01",
      color: "#F0C1E1",
      display: "block",
      customOrder: 3,
    },
    {
      // 휴가 신청은 하루 단위, end 없음
      title: "Event 2",
      start: "2025-06-02",
      color: "#A594F9",
      display: "block",
      customOrder: 1,
    },
    {
      // 공지사항은 하루 단위, end 없음
      title: "Event 1",
      start: "2025-06-08",
      color: "#A594F9",
      display: "block",
      customOrder: 1,
    },
    {
      title: "Event 2",
      start: "2025-06-08",
      color: "#A2D2DF",
      display: "block",
      customOrder: 2,
    },
    {
      // 휴가 신청은 하루 단위, end 없음
      title: "Event 2",
      start: "2025-06-08",
      color: "#F0C1E1",
      display: "block",
      customOrder: 3,
    },
    {
      // 공지사항은 하루 단위, end 없음
      title: "Event 1",
      start: "2025-06-15",
      color: "#A594F9",
      display: "block",
      customOrder: 1,
    },
    {
      title: "Event 2",
      start: "2025-06-15",
      color: "#A2D2DF",
      display: "block",
      customOrder: 2,
    },
    {
      // 휴가 신청은 하루 단위, end 없음
      title: "Event 2",
      start: "2025-06-15",
      color: "#F0C1E1",
      display: "block",
      customOrder: 3,
    },
    {
      // 공지사항은 하루 단위, end 없음
      title: "Event 1",
      start: "2025-06-22",
      color: "#A594F9",
      display: "block",
      customOrder: 1,
    },
    {
      title: "Event 2",
      start: "2025-06-22",
      color: "#A2D2DF",
      display: "block",
      customOrder: 2,
    },
    {
      // 휴가 신청은 하루 단위, end 없음
      title: "Event 2",
      start: "2025-06-22",
      color: "#F0C1E1",
      display: "block",
      customOrder: 3,
    },
    {
      // 공지사항은 하루 단위, end 없음
      title: "Event 1",
      start: "2025-06-29",
      color: "#A594F9",
      display: "block",
      customOrder: 1,
    },
    {
      title: "Event 2",
      start: "2025-06-29",
      color: "#A2D2DF",
      display: "block",
      customOrder: 2,
    },
    {
      // 휴가 신청은 하루 단위, end 없음
      title: "Event 2",
      start: "2025-06-29",
      color: "#F0C1E1",
      display: "block",
      customOrder: 3,
    },
  ]);

  // 공지사항 출력
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetchNotice();
        console.log(res);
        return data;
      } catch (error) {
        console.error(error);
        //alert("공지사항 로드 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, []);

  const handleEventClick = (info) => {
    const event = info.event;

    // 예시: 정보 출력
    console.log("클릭한 일정:", event.title);
    console.log("시작일:", event.startStr);
    console.log("종료일:", event.endStr);
    alert(`일정: ${event.title}\n시작: ${event.startStr}`);
  };

  // 새 이벤트 추가
  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleDateClick = (arg) => {
    // 선택한 날짜 저장
    setSelectedDate(arg.dateStr);

    // 이전 선택된 셀에서 클래스 제거
    if (selectedEl) {
      selectedEl.classList.remove("selected-day-border");
    }

    // 현재 선택된 셀에 클래스 추가
    arg.dayEl.classList.add("selected-day-border");

    // 현재 셀 기억해두기
    setSelectedEl(arg.dayEl);
  };

  return (
    <div className="relative">
      {/* 캘린더 영역 */}
      <div id="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]} // ✅ 수정
          initialView="dayGridMonth"
          height="auto"
          headerToolbar={{
            start: "prev next",
            center: "title",
            end: "     ",
          }}
          dateClick={handleDateClick}
          fixedWeekCount={false} // 필요 없는 주 생략
          events={events} // 이벤트 추가
          eventOrder="customOrder" // customOrder 작동을 위해 추가
          eventDidMount={(info) => {
            const el = info.el;

            // 기본 색상 저장
            const originalColor = info.event.backgroundColor;

            // hover 시 밝기 조정
            el.addEventListener("mouseenter", () => {
              el.style.filter = "brightness(105%)"; // 살짝 어둡게
            });
            el.addEventListener("mouseleave", () => {
              el.style.filter = "brightness(100%)"; // 원래대로
            });
          }}
          eventClick={handleEventClick} // 클릭 핸들러 연결
          dayCellContent={(arg) => {
            // 날짜 셀 상단에 버튼 포함한 구조 반환
            return (
              <div className="relative group">
                <div className="text-sm">{arg.dayNumberText}</div>
                <button
                  className="hidden group-hover:block absolute top-0 right-0 bg-gray-300 text-xs px-1 py-[2px] rounded"
                  onClick={(e) => {
                    e.stopPropagation(arg.dateStr); // 클릭 버블링 방지
                    // handleVacationCreate();
                  }}
                >
                  휴가 생성
                </button>
              </div>
            );
          }}
        />
      </div>

      {/* 휴가 입력 모달창 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <VacationRequestModal
            selectedDate={selectedDate}
            onClose={() => {
              setShowModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Calander;
