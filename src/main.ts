import type { Moment } from "moment";
import { Editor, Plugin } from "obsidian";
import { Timelive } from "./Timelive.ts";
import { DateFormat, TimeliveDateParser } from "./DateParser.ts";
import { DateTransformer } from "./DateTransformer.ts";
import { TimeliveDateFormatter } from "./DateFormatter.ts";
import { DEFAULT_SETTINGS, TimeliveSettings } from "./TimeliveSettings.ts";
import { TimeliveSettingTab } from "./TimeliveSettingTab.ts";

const REGEX_COMMON = /^\|(.{3,30}?)\|/;
const REGEX_COMMON_REPLACE = /^\s*<span.*?\/span>\|(.{3,30}?)\|\s*/gm;

export default class TimelivePlugin extends Plugin {
  settings: TimeliveSettings = DEFAULT_SETTINGS;

  override async onload() {
    await this.loadSettings();

    const transformer = new DateTransformer(
      new TimeliveDateParser(this.settings),
      new TimeliveDateFormatter(this.settings),
    );

    this.addCommand({
      id: "timelive-new-block",
      name: "New block",
      editorCallback: (editor: Editor) => {
        const formats: Record<DateFormat, string> = {
          ymd: "YYYY-MM-DD",
          dmy: "DD/MM/YYYY",
          mdy: "MM/DD/YYYY",
        };
        const format = formats[this.settings.parseDateFormat];
        // @ts-ignore: deno lack of type
        const moment: () => Moment = globalThis.moment;
        const dates = [
          { date: moment().subtract(1, "year"), desc: "Start" },
          { date: moment().subtract(1, "month"), desc: "One month ago" },
          { date: moment().subtract(1, "day"), desc: "Yesterday" },
        ].map(({ date, desc }) => "- |" + date.format(format) + "| " + desc);
        editor.replaceSelection(
          "## Demo\n\n" + dates.join("\n") + "\n- |now| Now\n",
        );
      },
    });

    this.registerMarkdownPostProcessor((element, _context) => {
      const ul = element.find("ul");
      if (!ul) return;

      const timelive = new Timelive(ul, transformer);
      for (const li of ul.findAll("li")) {
        // All list items must match a pattern
        const m = li.innerText.match(REGEX_COMMON);
        if (!m) return;
        const clone = li.cloneNode(true) as HTMLElement;
        clone.innerHTML = clone.innerHTML.replace(REGEX_COMMON_REPLACE, "");
        timelive.addEvent(m[1], clone);
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
