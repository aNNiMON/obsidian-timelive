import { TimeliveSettings } from "../src/TimeliveSettings";

export class MockTimeliveSettings implements TimeliveSettings {
  previewTitleDateFormat = "";
  parseDateFormat = "";

  static ofPreviewTitleDateFormat(format: string): MockTimeliveSettings {
    return { previewTitleDateFormat: format, parseDateFormat: "" };
  }

  static ofParseDateFormat(format: string): MockTimeliveSettings {
    return { previewTitleDateFormat: "", parseDateFormat: format };
  }
}