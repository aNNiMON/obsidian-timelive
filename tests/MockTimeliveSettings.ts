import { DateFormat } from "../src/DateParser.ts";
import { TimeliveSettings } from "../src/TimeliveSettings.ts";

export class MockTimeliveSettings implements TimeliveSettings {
  previewTitleDateFormat = "";
  parseDateFormat = DateFormat.YMD;

  static ofPreviewTitleDateFormat(format: string): MockTimeliveSettings {
    return { previewTitleDateFormat: format, parseDateFormat: DateFormat.YMD };
  }

  static ofParseDateFormat(format: DateFormat): MockTimeliveSettings {
    return { previewTitleDateFormat: "", parseDateFormat: format };
  }
}
