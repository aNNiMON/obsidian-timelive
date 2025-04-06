import { expect } from "jsr:@std/expect";
import { DateFormat, DateParser, TimeliveDateParser } from "../src/DateParser.ts";
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
      MockTimeliveSettings.ofParseDateFormat(DateFormat.YMD),
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
      MockTimeliveSettings.ofParseDateFormat(DateFormat.DMY),
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
      MockTimeliveSettings.ofParseDateFormat(DateFormat.MDY),
    );
    for (const dateStr of dates) {
      const result = dateParser.parseDate(dateStr);
      expect(result.toDate()).toEqual(expected);
    }
  });
});

Deno.test("DateParser spans", async (test) => {
  // @ts-ignore: deno lack of type
  const expectedFrom = moment("2008-02-09").toDate();
  const expectedTo = moment("2012-09-12").toDate();

  await test.step("should parse spans with dates in ymd format", () => {
    const dates = [
      "2008-02-09 - 2012-09-12",
      "2008/02/09 - 2012 09 12",
      "2008-2-9 - 2012 9 12",
      "08-2-9 - 12 9 12",
      "2008-02/09 - 2012/09-12",
    ];
    const dateParser: DateParser = new TimeliveDateParser(
      MockTimeliveSettings.ofParseDateFormat(DateFormat.YMD),
    );
    for (const dateStr of dates) {
      const result = dateParser.parseSpan(dateStr);
      expect(result.length).toEqual(2);
      expect(result[0].toDate()).toEqual(expectedFrom);
      expect(result[1].toDate()).toEqual(expectedTo);
    }
  });

  await test.step("should parse spans with dates in dmy format", () => {
    const dates = [
      "09-02-2008 - 12-09-2012",
      "09/02/2008 - 12 09 2012",
      "9-2-2008 - 12 9 2012",
      "9-2-08 - 12 9 12",
      "09/02-2008 - 12-09/2012",
    ];
    const dateParser: DateParser = new TimeliveDateParser(
      MockTimeliveSettings.ofParseDateFormat(DateFormat.DMY),
    );
    for (const dateStr of dates) {
      const result = dateParser.parseSpan(dateStr);
      expect(result.length).toEqual(2);
      expect(result[0].toDate()).toEqual(expectedFrom);
      expect(result[1].toDate()).toEqual(expectedTo);
    }
  });

  await test.step("should parse spans with dates in mdy format", () => {
    const dates = [
      "02-09-2008 - 09-12-2012",
      "02/09/2008 - 09 12 2012",
      "2-9-2008 - 9 12 2012",
      "2-9-08 - 9 12 12",
      "02/09-2008 - 09-12/2012",
    ];
    const dateParser: DateParser = new TimeliveDateParser(
      MockTimeliveSettings.ofParseDateFormat(DateFormat.MDY),
    );
    for (const dateStr of dates) {
      const result = dateParser.parseSpan(dateStr);
      expect(result.length).toEqual(2);
      expect(result[0].toDate()).toEqual(expectedFrom);
      expect(result[1].toDate()).toEqual(expectedTo);
    }
  });
});
