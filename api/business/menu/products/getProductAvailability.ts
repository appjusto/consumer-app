import { BusinessSchedule } from '@appjusto/types';
import { isEmpty } from 'lodash';

export const getProductAvailability = (availability: BusinessSchedule) => {
  return availability
    .map((day) => {
      if (!day.checked) return '';
      let result = `${day.day}`;
      (day.schedule ?? []).forEach((interval) => {
        if (!isEmpty(interval.from) && !isEmpty(interval.to)) {
          result +=
            ' das ' +
            interval.from.slice(0, 2) +
            ':' +
            interval.from.slice(2, 4) +
            ' às ' +
            interval.to.slice(0, 2) +
            ':' +
            interval.to.slice(2, 4);
        }
      });
      return result;
    })
    .filter((v) => !isEmpty(v))
    .join(', ');
};
