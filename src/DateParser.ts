export interface DateParser {
  parseDate(dateString: string): Date;
}

export const PARSE_DATE_FORMATS: Record<string, string> = {
  ymd: "Years Months Days",
  dmy: "Days Months Years",
  mdy: "Months Days Years",
};

const REGEX_PRESENT = /now|today|present/;

export class TimeliveDateParser implements DateParser {
  public parseDate(dateString: string): Date {
    if (REGEX_PRESENT.test(dateString)) {
      return new Date();
    }
    return new Date(dateString);
  }
}
