import { TimeliveSettings } from "./TimeliveSettings";
import { moment } from "obsidian";

export interface DateFormatter {
  formatDate(date: Date): string;
}

export class TimeliveDateFormatter implements DateFormatter {
  private readonly settings: TimeliveSettings;

  constructor(settings: TimeliveSettings) {
    this.settings = settings;
  }

  public formatDate(date: Date): string {
    return moment(date).format(this.settings.previewTitleDateFormat);
  }
}
