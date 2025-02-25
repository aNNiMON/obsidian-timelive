export interface DateParser {
  parseDate(dateString: string): Date;
}

const REGEX_PRESENT = /now|today|present/;

export class TimeliveDateParser implements DateParser {
  public parseDate(dateString: string): Date {
    if (REGEX_PRESENT.test(dateString)) {
      return new Date();
    }
    return new Date(dateString);
  }
}
