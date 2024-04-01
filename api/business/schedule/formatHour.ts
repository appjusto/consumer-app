export const formatHour = (value: string | undefined) => {
  let formatedNumber = '';
  if (value) {
    let hours = value.slice(0, 2);
    let minutes = value.slice(2, 4);
    if (parseInt(hours, 10) > 23) {
      hours = '00';
    }
    if (parseInt(minutes, 10) > 59) {
      minutes = '00';
    }
    if (minutes === '') {
      formatedNumber = `${hours}`;
    } else if (minutes !== '') {
      formatedNumber = `${hours}:${minutes}`;
    }
  }
  return formatedNumber;
};
