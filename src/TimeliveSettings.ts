import { DateFormat } from "./DateParser.ts";

export interface TimeliveSettings {
  previewTitleDateFormat: string;
  parseDateFormat: DateFormat;
}

export const DEFAULT_SETTINGS: TimeliveSettings = {
  previewTitleDateFormat: "YYYY-MM-DD",
  parseDateFormat: DateFormat.YMD,
};
