// 숫자 → "8:00 am" 형식으로 변환
export const formatHour = (hour) => {
  const suffix = hour < 12 ? "am" : "pm";
  const displayHour = hour <= 12 ? hour : hour - 12;
  return `${displayHour}:00 ${suffix}`;
};
