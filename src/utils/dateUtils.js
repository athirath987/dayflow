import {
  format,
  parseISO,
  isToday,
  isSameDay,
  addDays,
  getDay,
  getDaysInMonth,
  addMonths,
  subMonths
} from "date-fns";

export const todayString = () => format(new Date(), "yyyy-MM-dd");

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const parsed = parseISO(dateStr);
    return format(parsed, "EEEE, d MMMM, yyyy");
  } catch {
    return dateStr;
  }
};

export const formatShortDate = (date = new Date()) => {
  try {
    return format(date, "EEE, d MMM");
  } catch {
    return "";
  }
};

export const getTomorrowString = () => {
  return format(addDays(new Date(), 1), "yyyy-MM-dd");
};

export const getCalendarCells = (calendarDate) => {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekday = getDay(firstDayOfMonth); // 0 (Sun) to 6 (Sat)
  const numberOfDays = getDaysInMonth(calendarDate);

  const blanks = Array(firstWeekday).fill(null);
  const days = Array.from({ length: numberOfDays }, (_, i) => i + 1);

  return [...blanks, ...days];
};

export const formatMonthYear = (date) => {
  return format(date, "MMMM yyyy");
};

export const changeMonth = (currentDate, amount) => {
  return amount > 0 ? addMonths(currentDate, amount) : subMonths(currentDate, Math.abs(amount));
};

export {
  format,
  parseISO,
  isToday,
  isSameDay,
  addDays
};
