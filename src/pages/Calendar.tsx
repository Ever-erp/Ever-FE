import React, { useCallback, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../assets/styles/calendar.css";
import ScheduleCreateModal from "../components/specific/calendar/ScheduleCreateModal";
import VacationRequestModal from "../components/specific/calendar/VacationRequestModal";
import { useSelector } from "react-redux";
import { fetchAllCalendar } from "../services/calendar/fetchAllCalendar";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { formatDatePlusOne } from "../services/formatDateToLocalString";
import { useNavigate } from "react-router-dom";
import { deleteSchedule } from "../services/calendar/deleteClassSchedule";
import { deleteVacation } from "../services/calendar/deleteVacationSchedule";
import NoticePopover from "../components/specific/calendar/NoticePopover";
import VacationPopover from "../components/specific/calendar/VacationPopover";
import ScheduleViewModal from "../components/specific/calendar/ScheduleViewModal";
import Loading from "../components/common/Loading";
import CustomButton from "../components/common/CustomButton";
import { RootState } from "../store/store";
import { EventClickArg } from "@fullcalendar/core";

interface EventData {
  title: string;
  start: string;
  end?: string;
  color: string;
  display: string;
  customOrder: number;
  type: "notice" | "classSchedule" | "vacation";
  extendedProps: {
    id: number;
    type: string;
    customOrder?: number;
    [key: string]: any;
  };
}

interface SelectedEvent {
  id: number;
  type: string;
  customOrder: number;
}

export interface Popover {
  type: "notice" | "vacation";
  list: any[];
  position: {
    top: number;
    left: number;
  };
}

export interface NoticeItem {
  id: number;
  title: string;
  contents: string;
  pinned: boolean;
  registedAt: string;
  targetDate: string;
  targetRange: string;
  type: string;
  writer: string;
}

interface ClassSchedule {
  id: number;
  subjectName: string;
  classDesc: string;
  classUrl: string;
  startDate: string;
  endDate: string;
}

export interface ExtendedClassSchedule extends ClassSchedule {
  type: "classSchedule";
  customOrder?: number;
}

export interface VacationItem {
  id: number;
  memberId: number;
  memberName: string;
  vacationDate: string;
  vacationDesc: string;
  vacationType: string;
}

interface EventExtendedProps {
  id: number;
  type: "notice" | "classSchedule" | "vacation";
  customOrder?: number;
  [key: string]: any;
}

const Calender = () => {
  const user = useSelector((state: RootState) => state.user.user); // 전역 상태에서 사용자 정보 가져오기
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // 오늘 날짜(년-월-일) 문자열
  const [currentYM, setCurrentYM] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1, // JS는 0~11로 반환하므로 +1 필요 // 현재 날짜
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(
    null
  );

  const { isAuthenticated } = useAuthFetch();
  const navigate = useNavigate();
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [viewClassSchedule, setViewClassSchedule] =
    useState<ExtendedClassSchedule | null>(null);
  const [activePopover, setActivePopover] = useState<Popover | null>(null);

  const loadCalendarData = useCallback(async () => {
    if (!isAuthenticated) return;
    const { year, month } = currentYM;
    if (!year || !month) return;

    setIsLoading(true); // 시작 전 로딩창 설정

    try {
      const res = await fetchAllCalendar(year, month);
      const data = res.data;

      // [1] 공지사항
      const notices = data.notices || [];
      const groupedByDate = notices.reduce(
        (acc: Record<string, NoticeItem[]>, notice: NoticeItem) => {
          const date = notice.targetDate;
          if (!acc[date]) acc[date] = [];
          acc[date].push(notice);
          return acc;
        },
        {}
      );

      // 공지사항 날짜별 그룹핑
      // Object.entries(obj): [string, unknown][]로 항상 고정. 타입 단언으로 명시 해야 함
      const eventsFromNotices = Object.entries(
        groupedByDate as Record<string, NoticeItem[]>
      ).map(([date, noticeList]) => {
        const count = noticeList.length;
        const title =
          count === 1 ? `${noticeList[0].title}` : `총 ${count}건의 공지`;

        return {
          title,
          start: date,
          color: "#A594F9",
          display: "block",
          customOrder: 2,
          type: "notice",
          extendedProps: {
            id: noticeList[0].id,
            noticeList, // 전체 리스트 추가
          },
        };
      });

      // [2] 수업 일정
      const eventsFromClasses = (data.classes || []).flatMap(
        (cls: ClassSchedule) => {
          const start = new Date(cls.startDate);
          const end = new Date(cls.endDate);
          const dateList: Date[] = [];

          // 1. 평일만 추출
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const day = d.getDay(); // 0 = 일, 6 = 토
            if (day !== 0 && day !== 6) {
              dateList.push(new Date(d.getTime())); // 날짜 복사해서 배열에 저장
            }
          }
          // 2. 연속된 구간 묶기
          const ranges: { start: Date; end: Date }[] = [];
          let rangeStart: Date | null = null;
          let prevDate: Date | null = null;

          for (const date of dateList) {
            if (!rangeStart) {
              rangeStart = date; // 구간 시작 날짜 지정
            } else if (
              // 현재 날짜와 이전 날짜가 하루 차이(24시간) 아니면
              (date.getTime() - prevDate!.getTime()) / (1000 * 60 * 60 * 24) !==
              1
            ) {
              // 하루 차이가 아니면 끊어서 저장
              // !는 "절대 null 또는 undefined가 아니라는 뜻"의 타입스크립트 문법
              ranges.push({ start: rangeStart, end: prevDate! });
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
            end: formatDatePlusOne(range.end),
            color: "#A2D2DF",
            display: "block",
            customOrder: 1,
            type: "classSchedule",
            extendedProps: {
              id: cls.id,
              subjectName: cls.subjectName,
              classDesc: cls.classDesc,
              classUrl: cls.classUrl,
              startDate: cls.startDate,
              endDate: cls.endDate,
            },
          }));
        }
      );

      // [3] 휴가
      const vacations = data.vacations || [];
      const groupedVacationsByDate = vacations.reduce(
        (acc: Record<string, VacationItem[]>, vac: VacationItem) => {
          const date = vac.vacationDate;
          if (!acc[date]) acc[date] = [];
          acc[date].push(vac);
          return acc;
        },
        {}
      );

      // 휴가 이벤트 생성
      const eventsFromVacations = Object.entries(
        groupedVacationsByDate as Record<string, VacationItem[]>
      ).map(([date, vacationList]) => {
        const count = vacationList.length;
        const title =
          count === 1
            ? `${vacationList[0].memberName} ${vacationList[0].vacationType}`
            : `총 ${count}건의 휴가`;

        return {
          title,
          start: date,
          color: "#F0C1E1",
          display: "block",
          customOrder: 3,
          type: "vacation",
          extendedProps: {
            id: vacationList[0].id,
            vacationList, // 전체 휴가 리스트 추가
            memberName: vacationList[0].memberName, // 현재는 이름으로 함
          },
        };
      });

      const allEvents = [
        ...eventsFromNotices,
        ...eventsFromClasses,
        ...eventsFromVacations,
      ];

      // 기존 events 상태를 초기화하거나 필요한 경우 필터링 후 추가
      setEvents(allEvents);
    } catch (err) {
      console.error("캘린더 데이터 불러오기 실패:", err);
    } finally {
      setIsLoading(false); // ⬅️ 항상 종료 시 false
    }
  }, [currentYM, isAuthenticated]);

  // 달력이 바뀔 때마다 캘린더 데이터 로드
  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  const handleEventClick = (info: EventClickArg) => {
    const event = info.event.extendedProps as EventExtendedProps;
    const clickedId = event.id;
    const clickedType = event.type;

    // events 전체 순회하여 색상 변경
    setEvents((prevEvents) =>
      prevEvents.map((ev) => {
        if (ev.extendedProps.id === clickedId && ev.type === clickedType) {
          return {
            ...ev,
            color: "#60A5FA", // 강조 색상 (파란색)
          };
        } else {
          // 나머지는 기본 색상 복원
          return {
            ...ev,
            color:
              ev.type === "notice"
                ? "#A594F9"
                : ev.type === "classSchedule"
                ? "#A2D2DF"
                : "#F0C1E1",
          };
        }
      })
    );

    // 선택된 이벤트 저장
    setSelectedEvent({
      id: clickedId,
      type: clickedType,
      customOrder: event.customOrder ?? info.event.extendedProps.customOrder,
    });

    // 4) 나머지 원래 로직
    // 실제 로직 수행
    if (event.type === "notice") {
      navigate(`/notice/${event.id}`);
    } else if (event.type === "classSchedule") {
      setViewClassSchedule(event as ExtendedClassSchedule); // 수업 일정 보기용 모달 열기
    }
  };

  // 취소 버튼 클릭 시 이벤트 삭제
  const handleCancelEvent = async () => {
    if (!selectedEvent) return;

    // 확인창 추가: 휴가일 때만
    if (
      selectedEvent.type === "vacation" &&
      !window.confirm("정말 휴가를 취소하시겠습니까?")
    ) {
      return;
    }

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

  // 휴가 신청 버튼 클릭 핸들러
  const handleVacationApplyClick = () => {
    // 오늘 휴가가 이미 있나 검사
    const todayVacationExists = events.some(
      (ev) =>
        ev.type === "vacation" &&
        ev.start === todayStr &&
        ev.extendedProps?.memberName === user?.name // 휴가자 아이디가 로그인 사용자 아이디와 일치하는지 확인
    );

    if (todayVacationExists) {
      alert("당일 휴가는 이미 신청되어 있습니다.");
      return;
    }

    setShowModal(true);
  };
  return (
    <div className="relative md:self-start 3xl:self-auto">
      {isLoading && (
        <Loading fullscreen text="캘린더 데이터를 불러오는 중입니다..." />
      )}

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
          datesSet={(arg) => {
            const middleDate = new Date(
              (arg.view.currentStart.getTime() +
                arg.view.currentEnd.getTime()) /
                2
            );

            const newYear = middleDate.getFullYear();
            const newMonth = middleDate.getMonth() + 1;

            setCurrentYM((prev) => {
              if (prev.year === newYear && prev.month === newMonth) return prev;
              return { year: newYear, month: newMonth };
            });
          }}
          fixedWeekCount={false} // 필요 없는 주 생략
          events={events} // 이벤트 추가
          eventOrder="customOrder" // customOrder 작동을 위해 추가
          eventClick={handleEventClick} // 이벤트 클릭 이벤트
          eventDidMount={(info) => {
            const el = info.el;
            const { type, noticeList, vacationList } = info.event.extendedProps;

            el.addEventListener("mouseenter", () => {
              el.style.filter = "brightness(105%)";
              const rect = el.getBoundingClientRect();

              if (type === "notice" && noticeList?.length > 1) {
                if (hideTimeout.current !== null) {
                  clearTimeout(hideTimeout.current);
                }
                setActivePopover({
                  type: "notice",
                  list: noticeList,
                  position: {
                    top: rect.top,
                    left: rect.left + rect.width + 8,
                  },
                });
              } else if (type === "vacation" && vacationList?.length > 1) {
                if (hideTimeout.current !== null) {
                  clearTimeout(hideTimeout.current);
                }
                setActivePopover({
                  type: "vacation",
                  list: vacationList,
                  position: {
                    top: rect.top,
                    left: rect.left + rect.width + 8,
                  },
                });
              }
            });

            el.addEventListener("mouseleave", () => {
              el.style.filter = "brightness(100%)";
              hideTimeout.current = setTimeout(() => {
                setActivePopover(null);
              }, 100);
            });
          }}
        />
      </div>

      {/* 버튼 */}
      <div className="mt-3 flex justify-end">
        <div className="w-2/5 2xl:w-1/3 flex gap-2">
          {/* 휴가 취소 버튼 */}
          <CustomButton
            label="휴가 취소"
            className={`py-[1vh] rounded-lg w-full ${
              selectedEvent &&
              selectedEvent.type === "vacation" &&
              user?.position !== "ROLE_관리자"
                ? ""
                : "invisible"
            }`}
            variant="outline"
            onClick={handleCancelEvent}
          />
          {/* 저장 버튼 */}
          <CustomButton
            label={
              user?.position === "ROLE_관리자" ? "수업 일정 추가" : "휴가 신청"
            }
            className="py-[1vh] rounded-lg"
            variant="brand"
            onClick={() => {
              if (user?.position === "ROLE_관리자") {
                handleVacationApplyClick();
              } else {
                setShowModal(true);
              }
            }}
          />
        </div>
      </div>

      {/* 휴가 입력 모달창 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          {user?.position === "ROLE_관리자" ? (
            <ScheduleCreateModal
              onClose={() => setShowModal(false)}
              classId={user.classId}
              loadCalendarData={loadCalendarData}
            />
          ) : (
            <VacationRequestModal
              onClose={() => setShowModal(false)}
              loadCalendarData={loadCalendarData}
              user={user}
            />
          )}
        </div>
      )}

      {/* 공지사항 popover */}
      {activePopover?.type === "notice" && (
        <NoticePopover
          notices={activePopover.list}
          position={activePopover.position}
          onClose={() => setActivePopover(null)}
          hideTimeout={hideTimeout}
        />
      )}

      {/* 휴가 popover */}
      {activePopover?.type === "vacation" && (
        <VacationPopover
          vacations={activePopover.list}
          position={activePopover.position}
          onClose={() => setActivePopover(null)}
          hideTimeout={hideTimeout}
        />
      )}

      {viewClassSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <ScheduleViewModal
            onClose={() => setViewClassSchedule(null)}
            eventData={viewClassSchedule}
            onCancel={async () => {
              await handleCancelEvent(); // 삭제 후 모달 닫기
              setViewClassSchedule(null);
            }}
            user={user}
          />
        </div>
      )}
    </div>
  );
};

export default Calender;
