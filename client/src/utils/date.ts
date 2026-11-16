import { format } from "date-fns";

export const formatWeekRange = (start: Date, end: Date) => `${format(start, "MMM d")} \u2013 ${format(end, "MMM d")}`;
export const formatTaskCount = (count: number) => `${count} ${count === 1 ? "task" : "tasks"}`;
