import { TimeliveSettings } from "./TimeliveSettings";

export interface DateFormatter {
  formatDate(date: Date): string;
}

export class TimeliveDateFormatter implements DateFormatter {
  private readonly settings: TimeliveSettings;

  constructor(settings: TimeliveSettings) {
    this.settings = settings;
  }

  public formatDate(date: Date): string {
    return window.moment(date).format(this.settings.previewTitleDateFormat);
  }
}
