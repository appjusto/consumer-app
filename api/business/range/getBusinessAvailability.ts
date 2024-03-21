// import { shouldBusinessBeOpen } from '@appjusto/dates';
import { Dayjs, dateWithUpdatedTime, getDaySchedule, parseScheduleHour } from '@appjusto/dates';
import { BusinessAlgolia, BusinessSchedule, PublicBusiness } from '@appjusto/types';
import { isEmpty } from 'lodash';

export const shouldBeOpened = (
  schedule: BusinessSchedule,
  at: Date = new Date(),
  tz: string = 'America/Sao_Paulo'
) => {
  if (!schedule) return false;
  // hacky to deal with https://github.com/iamkun/dayjs/issues/1377
  const date = Dayjs(at).subtract(3, 'h');
  console.log(at, date);
  const daySchedule = getDaySchedule(schedule, date);
  if (!daySchedule || !daySchedule.checked) return false;
  if (isEmpty(daySchedule.schedule)) return true;
  return (
    daySchedule.schedule.find((value) => {
      const from = dateWithUpdatedTime(date, {
        hours: parseScheduleHour(value.from)[0],
        minutes: parseScheduleHour(value.from)[1],
      });
      const to = dateWithUpdatedTime(date, {
        hours: parseScheduleHour(value.to)[0],
        minutes: parseScheduleHour(value.to)[1],
      });
      return date.isSameOrAfter(from) && date.isSameOrBefore(to);
    }) !== undefined
  );
};

export type BusinessAvailability = 'open' | 'schedule-required' | 'closed';

export const getBusinessAvailability = (
  business: BusinessAlgolia | PublicBusiness,
  at: Date
): BusinessAvailability => {
  // const isOpen = shouldBusinessBeOpen(business.schedules, now);
  // const isOpen = shouldBeOpened(business.schedules, now);
  const isOpen = 'opened' in business ? business.opened : shouldBeOpened(business.schedules, at);
  // console.log('isOpen', isOpen);
  const acceptsSchedule = business.preparationModes?.includes('scheduled');
  if (!isOpen) {
    if (acceptsSchedule) return 'schedule-required';
    return 'closed';
  }
  return 'open';
};
