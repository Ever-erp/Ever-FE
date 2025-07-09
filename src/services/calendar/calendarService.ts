import { formatDateToLocalString } from "../formatDateToLocalString";

// "yyyy-mm-dd" 문자열 → Date 객체 (자정 기준)
const parseDate = (dateStr: string): Date => {
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  return new Date(year, month - 1, day);
};
// FullCalendar end는 exclusive이므로 하루 빼서 inclusive 처리
const getInclusiveEndDate = (dateStr: string): Date => {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() - 1);
  return date;
};

// 날짜 겹침 검사 함수
export const isOverlap = (
  startA: string,
  endA: string | null | undefined,
  startB: string,
  endB: string | null | undefined
): boolean => {
  const aStart = parseDate(startA);
  const aEnd = endA ? getInclusiveEndDate(endA) : aStart;
  const bStart = parseDate(startB);
  const bEnd = endB ? getInclusiveEndDate(endB) : bStart;

  return aStart <= bEnd && bStart <= aEnd;
};

// 주말인지 확인하는 함수
export const isWeekend = (dateStr: Date): boolean => {
  const date = parseDate(formatDateToLocalString(dateStr));
  const day = date.getDay(); // 0: 일요일, 6: 토요일
  return day === 0 || day === 6;
};
