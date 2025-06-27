// 유틸 함수로 정의 (컴포넌트 안에 작성해도 되고 별도 분리도 가능)
export const formatDateToLocalString = (date) => {
  return date.toLocaleDateString("sv-SE"); // "YYYY-MM-DD"
};

export const formatDatePlusOne = (dateStr) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0]; // yyyy-mm-dd 형식
};
