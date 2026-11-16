import { addDays, endOfWeek, format, startOfDay, startOfWeek } from 'date-fns';
export const dateFromString = (value) => startOfDay(new Date(`${value}T00:00:00Z`));
export const isoDay = (date) => format(date, 'yyyy-MM-dd');
export const weekRange = (date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return { start: startOfDay(start), end: endOfWeek(start, { weekStartsOn: 1 }) };
};
export const weekDates = (weekStart) => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
