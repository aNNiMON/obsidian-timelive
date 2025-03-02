import { expect } from "jsr:@std/expect";
import { DateParser, TimeliveDateParser } from "../src/DateParser.ts";
import { MockTimeliveSettings } from "./MockTimeliveSettings.ts";
import moment from "moment";

// @ts-ignore: deno lack of type
globalThis.moment = moment;

Deno.test("DateParser", async (test) => {
  // @ts-ignore: deno lack of type
  const expected = moment("2008-02-09").toDate();

  await test.step("should parse date in ymd format", () => {
    const dates = [
      "2008-02-09", "2008/02/09", "2008 02 09",
      "2008-2-9", "2008/2/9", "2008 2 9",
      "08-2-9", "08/2/9", "08 2 9",
      "8-2-9", "8/2/9", "8 2 9",
      "2008-02/09", "2008-02 09", "2008/02-09",
    ];
    const dateParser: DateParser = new TimeliveDateParser(
      MockTimeliveSettings.ofParseDateFormat("ymd"),
    );
    for (const dateStr of dates) {
      const result = dateParser.parseDate(dateStr);
      expect(result.toDate()).toEqual(expected);
    }
  });

  await test.step("should parse date in dmy format", () => {
    const dates = [
      "09-02-2008", "09/02/2008", "09 02 2008",
      "9-2-2008", "9/2/2008", "9 2 2008",
      "9-2-08", "9/2/08", "9 2 08",
      "9-2-8", "9/2/8", "9 2 8",
      "09/02-2008", "09 02-2008", "09-02/2008",
    ];
    const dateParser: DateParser = new TimeliveDateParser(
      MockTimeliveSettings.ofParseDateFormat("dmy"),
    );
    for (const dateStr of dates) {
      const result = dateParser.parseDate(dateStr);
      expect(result.toDate()).toEqual(expected);
    }
  });

  await test.step("should parse date in mdy format", () => {
    const dates = [
      "02-09-2008", "02/09/2008", "02 09 2008",
      "2-9-2008", "2/9/2008", "2 9 2008",
      "2-9-08", "2/9/08", "2 9 08",
      "2-9-8", "2/9/8", "2 9 8",
      "02/09-2008", "02 09-2008", "02-09/2008",
    ];
    const dateParser: DateParser = new TimeliveDateParser(
      MockTimeliveSettings.ofParseDateFormat("mdy"),
    );
    for (const dateStr of dates) {
      const result = dateParser.parseDate(dateStr);
      expect(result.toDate()).toEqual(expected);
    }
  });
});
