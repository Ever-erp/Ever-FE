import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar.css";
import CustomButton from "../components/common/CustomButton";
import ScheduleCreateModal from "../components/specific/calendar/ScheduleCreateModal";
import VacationRequestModal from "../components/specific/calendar/VacationRequestModal";
import { useSelector } from "react-redux";
import { isOverlap, isWeekend } from "../services/calendar/calendarService";
import { fetchNotice } from "../services/calendar/fetchNotice";
import { fetchAllCalendar } from "../services/calendar/fetchAllCalendar";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { formatDatePlusOne } from "../services/formatDateToLocalString";

const Calander = () => {
  const user = useSelector((state) => state.user.user); // 전역 상태에서 사용자 정보 가져오기

  const [currentYM, setCurrentYM] = useState({ year: null, month: null }); // 현재 날짜
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const { isAuthenticated } = useAuthFetch();

  // 달력이 바뀔 때마다 캘린더 데이터 로드
  useEffect(() => {
    if (!isAuthenticated) return;
    const { year, month } = currentYM;
    if (!year || !month) return;

    const loadCalendarData = async () => {
      try {
        const data = await fetchAllCalendar(year, month);
        // console.log(data);

        const eventsFromNotices = (data.notices || []).map((notice) => ({
          title: notice.title,
          start: notice.targetDate,
          color: "#A594F9",
          display: "block",
          customOrder: 1,
        }));

        const eventsFromClasses = (data.classes || []).map((cls) => ({
          title: cls.subjectName,
          start: cls.startDate,
          end: formatDatePlusOne(cls.endDate),
          color: "#A2D2DF",
          display: "block",
          customOrder: 2,
        }));

        const eventsFromVacations = (data.vacations || []).map((vac) => ({
          title: `${vac.memberId} ${vac.vacationType}`,
          start: vac.vacationDate,
          color: "#F0C1E1",
          display: "block",
          customOrder: 3,
        }));

        const allEvents = [
          ...eventsFromNotices,
          ...eventsFromClasses,
          ...eventsFromVacations,
        ];

        // 기존 events 상태를 초기화하거나 필요한 경우 필터링 후 추가
        setEvents(allEvents);
      } catch (err) {
        console.error("캘린더 데이터 불러오기 실패:", err);
      }
    };

    loadCalendarData();
  }, [currentYM, isAuthenticated]);

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
    let isSuccess = true;

    if (isWeekend(newEvent.start)) {
      alert("주말에는 일정을 추가할 수 없습니다.");
      return false;
    }

    setEvents((prevEvents) => {
      // 수업 일정은 겹치면 안됨
      if (newEvent.customOrder === 2) {
        const hasOverlap = prevEvents.some(
          (event) =>
            event.customOrder === 2 &&
            isOverlap(event.start, event.end, newEvent.start, newEvent.end)
        );

        if (hasOverlap) {
          alert("수업 일정이 겹칩니다. 다른 날짜를 선택해주세요.");
          isSuccess = false;
          return prevEvents;
        }
      } else {
        // 겹쳐도 상관없음
        const hasSameDateAndOrder = prevEvents.some(
          (event) =>
            event.customOrder === newEvent.customOrder &&
            event.start === newEvent.start
        );
        if (hasSameDateAndOrder) {
          isSuccess = false;
          return prevEvents;
        }
      }

      return [...prevEvents, newEvent];
    });

    return isSuccess; // 결과 반환
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
          // dateClick={handleDateClick}
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
          // 현재 년, 월
          datesSet={(arg) => {
            const year = arg.start.getFullYear();
            const month = arg.start.getMonth() + 1;
            console.log(year);
            console.log(month);
            setCurrentYM({ year, month });
          }}
        />
      </div>

      {/* 버튼 */}
      <div className="mt-3 flex justify-end">
        <div className="w-1/6">
          {/* 저장 버튼 */}
          <CustomButton
            label={user?.position === "관리자" ? "수업 일정 추가" : "휴가 신청"}
            className="py-[1vh] rounded-lg"
            variant="brand"
            size="md"
            onClick={() => {
              console.log(user.position);
              setShowModal(true);
            }}
          />
        </div>
      </div>

      {/* 휴가 입력 모달창 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          {user?.position === "관리자" ? (
            <ScheduleCreateModal
              onSubmit={(newEvent) => {
                addEvent(newEvent);
                setShowModal(false);
              }}
              onClose={() => setShowModal(false)}
            />
          ) : (
            <VacationRequestModal
              onSubmit={(newEvent) => {
                addEvent(newEvent);
                setShowModal(false);
              }}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Calander;
