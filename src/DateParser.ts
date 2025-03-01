import { TimeliveSettings } from "./TimeliveSettings";
import { moment } from "obsidian";

export interface DateParser {
  parseDate(dateString: string): Date;
}

export const PARSE_DATE_FORMATS: Record<string, string> = {
  ymd: "Years Months Days",
  dmy: "Days Months Years",
  mdy: "Months Days Years",
};

interface DateMatcher {
  pattern: RegExp;
  ymdIndices: number[];
}

const DATE_MATCHERS: Record<string, DateMatcher> = {
  ymd: { pattern: /(\d{1,4})[ \-/](\d{1,2})[ \-/](\d{1,2})/, ymdIndices: [1, 2, 3] },
  dmy: { pattern: /(\d{1,2})[ \-/](\d{1,2})[ \-/](\d{1,4})/, ymdIndices: [3, 2, 1] },
  mdy: { pattern: /(\d{1,2})[ \-/](\d{1,2})[ \-/](\d{1,4})/, ymdIndices: [3, 1, 2] },
};

const REGEX_PRESENT = /now|today|present/;

export class TimeliveDateParser implements DateParser {
  private readonly settings: TimeliveSettings;

  constructor(settings: TimeliveSettings) {
    this.settings = settings;
  }

  public parseDate(dateString: string): Date {
    if (REGEX_PRESENT.test(dateString)) {
      return new Date();
    }
    // First try according to the settings, then fallback to YMD
    const formats = [this.settings.parseDateFormat, "ymd"].unique();
    for (const format of formats) {
      const { pattern, ymdIndices } = DATE_MATCHERS[format];
      const m = dateString.match(pattern);
      if (m) {
        const yeartmp = parseInt(m[ymdIndices[0]]);
        const year = yeartmp < 100
          ? moment.parseTwoDigitYear(yeartmp.toString().padStart(2, "0"))
          : yeartmp;
        const month = parseInt(m[ymdIndices[1]]);
        const day = parseInt(m[ymdIndices[2]]);
        const datestr = [
          year.toString().padStart(4, "0"),
          month.toString().padStart(2, "0"),
          day.toString().padStart(2, "0")
        ].join("-");
        const date = moment(datestr, "YYYY-MM-DD");
        if (date.isValid()) {
          return date.toDate();
        }
      }
    }
    return new Date(dateString);
  }
}
