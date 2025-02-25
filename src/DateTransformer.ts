import { DateParser } from "./DateParser";
import { DateFormatter } from "./DateFormatter";

export class DateTransformer {
  constructor(public parser: DateParser, public formatter: DateFormatter) {
  }
}
