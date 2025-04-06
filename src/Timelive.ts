import type { Moment } from "moment";
import { DateTransformer } from "./DateTransformer.ts";
import { SingleTimeEvent, SpanTimeEvent, TimeEvent, TimeEventType } from "./TimeEvent.ts";

const DAYS_IN_YEAR = 365.2422;

export class Timelive {
  private root: HTMLElement;
  private transformer: DateTransformer;
  private events: TimeEvent[] = [];
  // For timeline computation
  private minDate?: Moment;
  private maxDate?: Moment;
  private startDateTime = 0;
  private totalDays = 0;

  constructor(root: HTMLElement, transformer: DateTransformer) {
    this.root = root;
    this.transformer = transformer;
  }

  public addEvent(dateString: string, content: string) {
    const dates = this.transformer.parser.parseSpan(dateString.trim().toLowerCase());
    switch (dates.length) {
      case 0:
        return;
      case 1:
        return this.addSingleEvent(dates[0], content);
      default:
        return this.addSpan(dates[0], dates[1], content);
    }
  }

  private addSingleEvent(date: Moment, content: string) {
    this.events.push(
      {
        date,
        content,
        position: 0,
        type: TimeEventType.Single,
      } as SingleTimeEvent,
    );
    this.recalculateMinMaxDates(date);
  }

  private addSpan(fromDate: Moment, toDate: Moment, content: string) {
    this.events.push(
      {
        fromDate,
        toDate,
        content,
        position: 0,
        width: 0,
        type: TimeEventType.Span,
      } as SpanTimeEvent,
    );
    this.recalculateMinMaxDates(fromDate);
    this.recalculateMinMaxDates(toDate);
  }

  private recalculateMinMaxDates(date: Moment) {
    const time = date.valueOf();
    if (!this.minDate || !this.maxDate) {
      this.minDate = date;
      this.maxDate = date;
      this.startDateTime = time;
    } else {
      if (time < this.minDate.valueOf()) {
        this.minDate = date;
        this.startDateTime = time;
      } else if (time > this.maxDate.valueOf()) {
        this.maxDate = date;
      } else return; // no updates to min/max dates -> skip
    }
    // Recalculate total days
    const deltaYears = 1 + this.maxDate.diff(this.minDate, "years");
    this.totalDays = deltaYears * DAYS_IN_YEAR;
  }

  public render() {
    this.root.innerHTML = "";
    this.root.style.minWidth = "100%";
    this.renderYears();
    this.renderLine();
  }

  private renderYears() {
    const yearsContainer = this.root.createDiv({ cls: "tlv-years" });
    const fromYear = this.minDate?.year() ?? (new Date().getFullYear());
    const toYear = 1 + (this.maxDate?.year() ?? fromYear);
    const years: Set<number> = this.splitYears(new Set<number>(), fromYear, toYear, 0);
    [...years]
      .sort()
      .forEach((year) => yearsContainer.createSpan({ text: `${year}` }));
  }

  private renderLine() {
    const timelineLine = this.root.createDiv({ cls: "tlv-timeline" });
    if (this.minDate && this.maxDate) {
      const highlight = timelineLine.createDiv({ cls: "tlv-timeline-highlight" });
      const start = this.calculatePosition(this.minDate);
      const width = this.calculatePosition(this.maxDate) - start;
      highlight.style.left = `${start}%`;
      highlight.style.width = `${width}%`;
    }
    this.mergeClosestEvents(this.events)
      .forEach((event) => {
        switch (event.type) {
          case TimeEventType.Single:
            this.createMarker(timelineLine, event as SingleTimeEvent);
            break;
          case TimeEventType.Span:
            this.createSpan(timelineLine, event as SpanTimeEvent);
            break;
        }
      });
  }

  private createMarker(line: HTMLElement, event: SingleTimeEvent) {
    const marker = line.createDiv({ cls: "tlv-marker" });
    marker.style.left = `${event.position}%`;
    this.createPopover(marker, this.formatSingleEvent(event));
  }

  private createSpan(line: HTMLElement, event: SpanTimeEvent) {
    const span = line.createDiv({ cls: "tlv-span" });
    span.style.left = `${event.position}%`;
    span.style.width = `${event.width}%`;
    this.createPopover(span, this.formatSpan(event));
  }

  private createPopover(marker: HTMLElement, html: string) {
    const popup = marker.createDiv({ cls: "tlv-popup popover hover-popover" });
    popup.innerHTML = html;
    marker.onmouseover = marker.ontouchstart = () => {
      popup.style.display = "block";
    };
    marker.onmouseout = marker.ontouchend = () => {
      popup.style.display = "none";
    };
  }

  private mergeClosestEvents(events: TimeEvent[]): TimeEvent[] {
    const CLOSEST_DELTA = 1; // %
    const merged: TimeEvent[] = [];
    let lastPosition: number;
    events
      .filter((event) => event.type === TimeEventType.Span)
      .map((event) => event as SpanTimeEvent)
      .sort((a, b) => a.fromDate.valueOf() - b.fromDate.valueOf())
      .forEach((event) => {
        event.position = this.calculatePosition(event.fromDate);
        event.width = this.calculatePosition(event.toDate) - event.position;
        merged.push(event);
      });
    events
      .filter((event) => event.type === TimeEventType.Single)
      .map((event) => event as SingleTimeEvent)
      .sort((a, b) => a.date.valueOf() - b.date.valueOf())
      .forEach((event, i) => {
        event.position = this.calculatePosition(event.date);
        if (i > 0 && (event.position - lastPosition) < CLOSEST_DELTA) {
          merged[merged.length - 1].content += this.formatSingleEvent(event, "<hr/>");
        } else {
          lastPosition = event.position;
          merged.push(event);
        }
      });
    return merged;
  }

  private formatSingleEvent(event: SingleTimeEvent, before = ""): string {
    const date = this.transformer.formatter.formatDate(event.date);
    return before +
      `<h4 class="tlv-date-title">${date}</h4>` +
      event.content;
  }

  private formatSpan(event: SpanTimeEvent, before = ""): string {
    const date = this.transformer.formatter.formatSpan(event.fromDate, event.toDate);
    return before +
      `<h4 class="tlv-date-title">${date}</h4>` +
      event.content;
  }

  private calculatePosition(date: Moment): number {
    const deltaDays = date.diff(this.startDateTime, "days");
    const value = (deltaDays / this.totalDays) * 100;
    // Round to 3 decimal points
    return Math.round(value * 1000) / 1000;
  }

  // Recursively split years for building a years line
  private splitYears(years: Set<number>, a: number, b: number, level: number): Set<number> {
    if (level < 3 && a != b) {
      years.add(a).add(b);
      const average = Math.floor(a / 2 + b / 2);
      this.splitYears(years, a, average, level + 1);
      this.splitYears(years, average, b, level + 1);
    }
    return years;
  }
}
