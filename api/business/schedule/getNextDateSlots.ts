import { Dayjs, dateWithUpdatedTime, parseScheduleHour, scheduleFromDate } from '@appjusto/dates';
import { PublicBusiness } from '@appjusto/types';

export const getNextDateSlots = (
  business: PublicBusiness,
  reference: Date,
  interval: number = 30,
  weeks: number = 1,
  limit: number = 1000000
) => {
  const schedule = business.schedules ? scheduleFromDate(business.schedules, reference, weeks) : [];
  // console.log('getNextDateSlots', schedule);
  const minHours = business.minHoursForScheduledOrders ?? 0;
  let total = 0;
  return schedule.reduce<Date[][]>((result, { checked, schedule: daySchedule }, i) => {
    if (!checked) return result;
    const dates = daySchedule.reduce((r, { from, to }) => {
      if (total >= limit) return r;
      const [fromHours, fromMinutes] = parseScheduleHour(from);
      const f = Dayjs(
        dateWithUpdatedTime(Dayjs(reference).add(i, 'day'), {
          hours: fromHours,
          minutes: fromMinutes,
        })
      );
      const [toHours, toMinutes] = parseScheduleHour(to);
      const t = Dayjs(
        dateWithUpdatedTime(Dayjs(reference).add(i, 'day'), {
          hours: toHours,
          minutes: toMinutes,
        })
      );
      const r2: Date[] = [];
      let n = business.averageCookingTime
        ? f.clone().add(business.averageCookingTime, 'second')
        : f.clone().add(interval, 'minute');
      while (n.isBefore(t)) {
        if (total >= limit) break;
        const diff = n.diff(reference, 'minute');
        if (diff > minHours * 60) {
          total++;
          r2.push(n.toDate());
        }
        n = n.clone().add(interval, 'minute');
      }
      if (r2.length) return [...r, ...r2];
      return r;
    }, [] as Date[]);
    if (dates.length) return [...result, dates];
    return result;
  }, []);
};
