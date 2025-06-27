import React, { useCallback, useEffect, useState } from "react";
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
import { fetchAllCalendar } from "../services/calendar/fetchAllCalendar";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { formatDatePlusOne } from "../services/formatDateToLocalString";
import { useNavigate } from "react-router-dom";
import { deleteSchedule } from "../services/calendar/deleteClassSchedule";
import { deleteVacation } from "../services/calendar/deleteVacationSchedule";

const Calander = () => {
  const user = useSelector((state) => state.user.user); // 전역 상태에서 사용자 정보 가져오기

  const [currentYM, setCurrentYM] = useState({ year: null, month: null }); // 현재 날짜
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const { isAuthenticated } = useAuthFetch();
  const navigate = useNavigate();

  const [selectedEvent, setSelectedEvent] = useState(null); // 클릭된 이벤트 저장

  const loadCalendarData = useCallback(async () => {
    if (!isAuthenticated) return;
    const { year, month } = currentYM;
    if (!year || !month) return;

    try {
      const res = await fetchAllCalendar(year, month);
      const data = res.data;

      const notices = data.notices || [];
      const groupedByDate = notices.reduce((acc, notice) => {
        const date = notice.targetDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push(notice);
        return acc;
      }, {});
      // [1-2] 날짜별 이벤트 생성
      const eventsFromNotices = Object.entries(groupedByDate).map(
        ([date, noticeList]) => {
          const firstNotice = noticeList[0];
          const title = "공지) " + firstNotice.title;
          // noticeList.length

          return {
            title,
            start: date,
            color: "#A594F9",
            display: "block",
            customOrder: 1,
            type: "notice",
            extendedProps: {
              id: 1, // 해당 날짜 공지 ID 리스트
            },
          };
        }
      );

      // [2] 수업 일정
      const eventsFromClasses = (data.classes || []).flatMap((cls) => {
        const start = new Date(cls.startDate);
        const end = new Date(cls.endDate);
        const dateList = [];

        // 1. 평일만 추출
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const day = d.getDay(); // 0 = 일, 6 = 토
          if (day !== 0 && day !== 6) {
            dateList.push(new Date(d)); // 복사해서 넣어야 함
          }
        }

        // 2. 연속된 구간 묶기
        const ranges = [];
        let rangeStart = null;
        let prevDate = null;

        for (const date of dateList) {
          if (!rangeStart) {
            rangeStart = date;
          } else if ((date - prevDate) / (1000 * 60 * 60 * 24) !== 1) {
            // 하루 차이가 아니면 끊어서 저장
            ranges.push({ start: rangeStart, end: prevDate });
            rangeStart = date;
          }
          prevDate = date;
        }

        // 마지막 구간 추가
        if (rangeStart && prevDate) {
          ranges.push({ start: rangeStart, end: prevDate });
        }

        // 3. FullCalendar 이벤트로 변환
        return ranges.map((range) => ({
          title: cls.subjectName,
          start: range.start.toISOString().split("T")[0],
          end: formatDatePlusOne(range.end.toISOString().split("T")[0]), // end는 exclusive
          color: "#A2D2DF",
          display: "block",
          customOrder: 2,
          type: "classSchedule",
          extendedProps: {
            id: cls.id,
          },
        }));
      });

      // [3] 휴가 일정
      const eventsFromVacations = (data.vacations || []).map((vac) => ({
        title: `${vac.memberName} ${vac.vacationType}`,
        start: vac.vacationDate,
        color: "#F0C1E1",
        display: "block",
        customOrder: 3,
        type: "vacation",
        extendedProps: {
          id: vac.id,
        },
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
  }, [currentYM, isAuthenticated]);

  // 달력이 바뀔 때마다 캘린더 데이터 로드
  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  const handleEventClick = (info) => {
    const event = info.event.extendedProps;
    console.log(event);
    if (event.type === "notice") {
      navigate(`/notice/${event.id}`);
    } else if (event.type === "classSchedule") {
      setSelectedEvent({
        id: event.id,
        type: event.type,
        customOrder: event.customOrder ?? event.event.customOrder, // 필요하면
        // start: event.startStr,
        // end: event.endStr,
        // title: event.title,
      });
    } else if (event.type === "vacation") {
      setSelectedEvent({
        id: event.id,
        type: event.type,
        customOrder: event.customOrder ?? event.event.customOrder, // 필요하면
      });
    }
  };

  // 취소 버튼 클릭 시 이벤트 삭제
  const handleCancelEvent = async () => {
    if (!selectedEvent) return;

    try {
      // 서버에서 삭제 요청 (수업 일정일 경우에만 삭제)
      if (selectedEvent.type === "classSchedule") {
        await deleteSchedule(selectedEvent.id);
      } else if (selectedEvent.type === "vacation") {
        await deleteVacation(selectedEvent.id);
      }
      await loadCalendarData(); // 최신 데이터 불러오기
      setSelectedEvent(null); // 선택 초기화
    } catch (err) {
      alert("삭제에 실패했습니다.");
      console.error("삭제 실패:", err);
    }
  };
  return (
    <div className="relative">
      {/* 캘린더 영역 */}
      <div id="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          headerToolbar={{
            start: "title",
            center: "",
            end: "prev next",
          }}
          // dateClick={handleDateClick}
          fixedWeekCount={false} // 필요 없는 주 생략
          events={events} // 이벤트 추가
          eventOrder="customOrder" // customOrder 작동을 위해 추가
          eventDidMount={(info) => {
            const el = info.el;

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
            const date = new Date(arg.view.currentStart);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            console.log(year);
            console.log(month);
            setCurrentYM({ year, month });
            setSelectedEvent(null); // 화면 이동 시 선택 초기화
          }}
        />
      </div>

      {/* 버튼 */}
      <div className="mt-3 flex justify-end">
        <div className="w-1/3 flex gap-4">
          <CustomButton
            label={user?.position === "관리자" ? "수업 일정 삭제" : "휴가 취소"}
            className={`py-[1vh] rounded-lg w-full ${
              selectedEvent ? "" : "invisible"
            }`}
            variant="outline"
            size="md"
            onClick={handleCancelEvent}
          />
          {/* 저장 버튼 */}
          <CustomButton
            label={user?.position !== "관리자" ? "수업 일정 추가" : "휴가 신청"}
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
          {user?.position !== "관리자" ? (
            <ScheduleCreateModal
              onClose={() => setShowModal(false)}
              classId={user.classId}
              loadCalendarData={loadCalendarData}
            />
          ) : (
            <VacationRequestModal
              onClose={() => setShowModal(false)}
              loadCalendarData={loadCalendarData}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Calander;
