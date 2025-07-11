import { DateFormat } from "../src/DateParser.ts";
import { TimeliveSettings } from "../src/TimeliveSettings.ts";

export class MockTimeliveSettings implements TimeliveSettings {
  previewTitleDateFormat = "";
  calendarMonthFormat = "";
  parseDateFormat = DateFormat.YMD;

  static ofPreviewTitleDateFormat(format: string): MockTimeliveSettings {
    return { previewTitleDateFormat: format, calendarMonthFormat: "", parseDateFormat: DateFormat.YMD };
  }
  
  static ofCalendarMonthFormat(format: string): MockTimeliveSettings {
    return { previewTitleDateFormat: "", calendarMonthFormat: format, parseDateFormat: DateFormat.YMD };
  }

  static ofParseDateFormat(format: DateFormat): MockTimeliveSettings {
    return { previewTitleDateFormat: "", calendarMonthFormat: "", parseDateFormat: format };
  }
}
