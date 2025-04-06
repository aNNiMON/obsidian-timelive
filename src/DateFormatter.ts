import type { Moment } from "moment";
import { TimeliveSettings } from "./TimeliveSettings.ts";

export interface DateFormatter {
  formatSpan(fromDate: Moment, toDate: Moment): string;
  formatDate(date: Moment): string;
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
}
