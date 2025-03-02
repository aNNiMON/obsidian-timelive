import type { Moment } from "moment";
import { TimeliveSettings } from "./TimeliveSettings.ts";

export interface DateFormatter {
  formatDate(date: Moment): string;
}

export class TimeliveDateFormatter implements DateFormatter {
  private readonly settings: TimeliveSettings;

  constructor(settings: TimeliveSettings) {
    this.settings = settings;
  }

  public formatDate(date: Moment): string {
    return date.format(this.settings.previewTitleDateFormat);
  }
}
