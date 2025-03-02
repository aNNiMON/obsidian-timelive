import type { Moment } from "moment";
import { TimeliveSettings } from "./TimeliveSettings.ts";

export interface DateFormatter {
  formatDate(date: Date): string;
}

export class TimeliveDateFormatter implements DateFormatter {
  private readonly settings: TimeliveSettings;

  constructor(settings: TimeliveSettings) {
    this.settings = settings;
  }

  public formatDate(date: Date): string {
    // @ts-ignore: deno lack of type
    const moment: (string) => Moment = globalThis.moment;
    return moment(date).format(this.settings.previewTitleDateFormat);
  }
}
