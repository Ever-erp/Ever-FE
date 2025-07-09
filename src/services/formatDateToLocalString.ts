// 유틸 함수로 정의 (컴포넌트 안에 작성해도 되고 별도 분리도 가능)
export const formatDateToLocalString = (date: Date): string => {
  return date.toLocaleDateString("sv-SE"); // "sv-SE" 로케일은 ISO 형식 (YYYY-MM-DD)
};

export const formatDatePlusOne = (dateStr: string | Date) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0]; // yyyy-mm-dd 형식
};

export const parseDateFromString = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};
