import { App, PluginSettingTab, Setting } from "obsidian";
import TimelivePlugin from "./main.ts";
import { DateFormat, PARSE_DATE_FORMATS } from "./DateParser.ts";

export class TimeliveSettingTab extends PluginSettingTab {
  plugin: TimelivePlugin;

  constructor(app: App, plugin: TimelivePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Preview title date format")
      .setDesc("Date format for titles in the date preview popup")
      .addMomentFormat((mf) => {
        mf.setValue(this.plugin.settings.previewTitleDateFormat);
        mf.onChange((value: string) => {
          this.plugin.settings.previewTitleDateFormat = value;
          this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Calendar month format")
      .setDesc("Calendar row format for years and months only")
      .addMomentFormat((mf) => {
        mf.setValue(this.plugin.settings.calendarMonthFormat);
        mf.onChange((value: string) => {
          this.plugin.settings.calendarMonthFormat = value;
          this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Parse date format")
      .setDesc("Preferred date format for parsing markdown dates in lists")
      .addDropdown((dropdown) => {
        dropdown.addOptions(PARSE_DATE_FORMATS);
        dropdown.setValue(this.plugin.settings.parseDateFormat);
        dropdown.onChange((value: string) => {
          this.plugin.settings.parseDateFormat = value as DateFormat;
          this.plugin.saveSettings();
        });
      });
  }
}
