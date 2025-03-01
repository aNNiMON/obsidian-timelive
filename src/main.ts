import { Plugin } from "obsidian";
import { Timelive } from "./Timelive";
import { TimeliveDateParser } from "./DateParser";
import { DateTransformer } from "./DateTransformer";
import { TimeliveDateFormatter } from "./DateFormatter";
import { DEFAULT_SETTINGS, TimeliveSettings } from "./TimeliveSettings";
import { TimeliveSettingTab } from "./TimeliveSettingTab";

const REGEX_COMMON: RegExp = /^\|(.{3,30}?)\|/;
const REGEX_COMMON_REPLACE: RegExp = /^\s*<span.*?\/span>\|(.{3,30}?)\|\s*/gm;

export default class TimelivePlugin extends Plugin {
  settings: TimeliveSettings = DEFAULT_SETTINGS;

  override async onload() {
    await this.loadSettings();

    const transformer = new DateTransformer(
      new TimeliveDateParser(),
      new TimeliveDateFormatter(),
    );

    this.registerMarkdownPostProcessor((element, _context) => {
      const ul = element.find("ul");
      if (!ul) return;

      const timelive = new Timelive(ul, transformer);
      for (const li of ul.findAll("li")) {
        // All list items must match a pattern
        const m = li.innerText.match(REGEX_COMMON);
        if (!m) return;

        timelive.addEvent(
          m[1],
          li.innerHTML.replace(REGEX_COMMON_REPLACE, ""),
        );
      }
      timelive.render();
    });

    this.addSettingTab(new TimeliveSettingTab(this.app, this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
