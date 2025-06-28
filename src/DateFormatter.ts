import type { Moment } from "moment";
import { TimeliveSettings } from "./TimeliveSettings.ts";
import { TimeUnit } from "./TimeUnit.ts";

export interface DateFormatter {
  formatSpan(fromDate: Moment, toDate: Moment): string;
  formatDate(date: Moment): string;
  formatCalendarDate(date: Moment, unit: TimeUnit): string;
}

export class TimeliveDateFormatter implements DateFormatter {
  private readonly settings: TimeliveSettings;

  constructor(settings: TimeliveSettings) {
    this.settings = settings;
  }

  public formatSpan(fromDate: Moment, toDate: Moment): string {
    return this.formatDate(fromDate) + " - " + this.formatDate(toDate);
  }

  public formatDate(date: Moment): string {
    return date.format(this.settings.previewTitleDateFormat);
  }

  public formatCalendarDate(date: Moment, unit: TimeUnit): string {
    if (unit === TimeUnit.Month) {
      return date.format("YYYY-MM");
    } else {
      return date.format("YYYY");
    }
  }
}
