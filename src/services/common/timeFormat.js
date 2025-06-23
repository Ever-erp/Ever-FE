const localDateTimeToDateTime = (localDateTime) => {
  const dateTime = new Date(localDateTime);
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1;
  const day = dateTime.getDate();
  const hour = dateTime.getHours();
  const minute = dateTime.getMinutes();
  const second = dateTime.getSeconds();

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
  };
};

export { localDateTimeToDateTime };
