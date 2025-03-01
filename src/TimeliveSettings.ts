export interface TimeliveSettings {
  previewTitleDateFormat: string;
  parseDateFormat: string;
}

export const DEFAULT_SETTINGS: TimeliveSettings = {
  previewTitleDateFormat: "YYYY-MM-DD",
  parseDateFormat: "ymd",
};
