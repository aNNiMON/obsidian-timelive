import { DateFormat } from "./DateParser.ts";

export interface TimeliveSettings {
  previewTitleDateFormat: string;
  calendarMonthFormat: string;
  parseDateFormat: DateFormat;
}

export const DEFAULT_SETTINGS: TimeliveSettings = {
  previewTitleDateFormat: "YYYY-MM-DD",
  calendarMonthFormat: "YYYY-MM",
  parseDateFormat: DateFormat.YMD,
};
