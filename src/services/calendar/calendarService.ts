// "yyyy-mm-dd" 문자열 → Date 객체 (자정 기준)
const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return new Date(year, month - 1, day);
};

// FullCalendar end는 exclusive이므로 하루 빼서 inclusive 처리
const getInclusiveEndDate = (dateStr) => {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() - 1);
  return date;
};

// 날짜 겹침 검사 함수
export const isOverlap = (startA, endA, startB, endB) => {
  const aStart = parseDate(startA);
  const aEnd = endA ? getInclusiveEndDate(endA) : aStart;
  const bStart = parseDate(startB);
  const bEnd = endB ? getInclusiveEndDate(endB) : bStart;

  return aStart <= bEnd && bStart <= aEnd;
};

// 주말인지 확인하는 함수
export const isWeekend = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0: 일요일, 6: 토요일
  return day === 0 || day === 6;
};
