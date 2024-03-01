import { Dayjs, dateWithUpdatedTime, parseScheduleHour, scheduleFromDate } from '@appjusto/dates';
import { BusinessSchedule } from '@appjusto/types';

const platformSchedule: BusinessSchedule = [
  { day: 'Segunda', checked: true, schedule: [{ from: '0700', to: '2359' }] },
  { day: 'Terça', checked: true, schedule: [{ from: '0700', to: '2359' }] },
  { day: 'Quarta', checked: true, schedule: [{ from: '0700', to: '2359' }] },
  { day: 'Quinta', checked: true, schedule: [{ from: '0700', to: '2359' }] },
  { day: 'Sexta', checked: true, schedule: [{ from: '0700', to: '2359' }] },
  { day: 'Sábado', checked: true, schedule: [{ from: '0700', to: '2359' }] },
  { day: 'Domingo', checked: true, schedule: [{ from: '0700', to: '2359' }] },
];

export const getP2PNextDateSlots = (
  reference: Date,
  interval: number = 30,
  weeks: number = 1,
  limit: number = 1000000
) => {
  const schedule = scheduleFromDate(platformSchedule, reference, weeks);
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
      let n = f.clone().add(interval, 'minute');
      while (n.isBefore(t)) {
        if (total >= limit) break;
        const diff = n.diff(reference, 'minute');
        if (diff > 1 * 60) {
          total++;
          r2.push(n.toDate());
        }
        n = n.clone().add(interval, 'minute');
      }
      return [...r, ...r2];
    }, [] as Date[]);
    return [...result, dates];
  }, []);
};
