import { DateParser } from "./DateParser.ts";
import { DateFormatter } from "./DateFormatter.ts";

export class DateTransformer {
  constructor(public parser: DateParser, public formatter: DateFormatter) {
  }
}
