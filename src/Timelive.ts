import type { Moment } from "moment";
import { DateTransformer } from "./DateTransformer.ts";
import { DynamicTimelineBuilder, TimelineBuilder } from "./TimelineBuilder.ts";
import { SingleTimeEvent, SpanTimeEvent, TimeEvent, TimeEventType } from "./TimeEvent.ts";

export class Timelive {
  private root: HTMLElement;
  private transformer: DateTransformer;
  private timelineBuilder: TimelineBuilder;
  private events: TimeEvent[] = [];

  constructor(root: HTMLElement, transformer: DateTransformer) {
    this.root = root;
    this.transformer = transformer;
    this.timelineBuilder = new DynamicTimelineBuilder();
  }

  public addEvent(dateString: string, content: HTMLElement) {
    const dates = this.transformer.parser.parseSpan(
      dateString.trim().toLowerCase(),
    );
    switch (dates.length) {
      case 0:
        return;
      case 1:
        return this.addSingleEvent(dates[0], content);
      default:
        return this.addSpan(dates[0], dates[1], content);
    }
  }

  private addSingleEvent(date: Moment, content: HTMLElement) {
    this.events.push(
      {
        date,
        content,
        position: 0,
        type: TimeEventType.Single,
      } as SingleTimeEvent,
    );
    this.timelineBuilder.addDate(date);
  }

  private addSpan(fromDate: Moment, toDate: Moment, content: HTMLElement) {
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
    this.timelineBuilder.addDate(fromDate);
    this.timelineBuilder.addDate(toDate);
  }

  public render() {
    this.root.empty();
    this.root.style.minWidth = "100%";
    this.renderCalendar();
    this.renderLine();
  }

  private renderCalendar() {
    const yearsContainer = this.root.createDiv({ cls: "tlv-years" });
    const { dates, unit } = this.timelineBuilder.buildCalendarDates();
    const fmt = this.transformer.formatter;
    [...dates]
      .sort((a, b) => a.valueOf() - b.valueOf())
      .map((date) => fmt.formatCalendarDate(date, unit))
      .unique()
      .forEach((date) => yearsContainer.createSpan({ text: `${date}` }));
  }

  private renderLine() {
    const timelineLine = this.root.createDiv({ cls: "tlv-timeline" });
    const { min, max } = this.timelineBuilder.getActualTimeSpan();
    if (min && max) {
      const highlight = timelineLine.createDiv({
        cls: "tlv-timeline-highlight",
      });
      const start = this.timelineBuilder.calculatePosition(min);
      const width = this.timelineBuilder.calculatePosition(max) - start;
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
    const popover = this.createPopover(marker);
    this.formatSingleEvent(popover, event);
  }

  private createSpan(line: HTMLElement, event: SpanTimeEvent) {
    const span = line.createDiv({ cls: "tlv-span" });
    span.style.left = `${event.position}%`;
    span.style.width = `${event.width}%`;
    const popover = this.createPopover(span);
    this.formatSpan(popover, event);
  }

  private createPopover(marker: HTMLElement): HTMLElement {
    const popover = document.body.createDiv({
      cls: "tlv-popup popover hover-popover",
    });
    popover.onmouseover =
      popover.ontouchstart =
      marker.onmouseover =
      marker.ontouchstart =
        () => {
          const { x, y } = this.getPopoverPosition(marker);
          popover.style.left = `${x}px`;
          popover.style.top = `${y}px`;
          popover.style.display = "block";
        };
    popover.onmouseout =
      popover.ontouchend =
      marker.onmouseout =
      marker.ontouchend =
        () => {
          popover.style.display = "none";
        };
    return popover;
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
        event.position = this.timelineBuilder.calculatePosition(event.fromDate);
        event.width = this.timelineBuilder.calculatePosition(event.toDate) - event.position;
        merged.push(event);
      });
    events
      .filter((event) => event.type === TimeEventType.Single)
      .map((event) => event as SingleTimeEvent)
      .sort((a, b) => a.date.valueOf() - b.date.valueOf())
      .forEach((event, i) => {
        event.position = this.timelineBuilder.calculatePosition(event.date);
        if (i > 0 && (event.position - lastPosition) < CLOSEST_DELTA) {
          const lastEl = merged[merged.length - 1].content;
          lastEl.createEl("hr");
          this.formatSingleEvent(lastEl, event);
        } else {
          lastPosition = event.position;
          merged.push(event);
        }
      });
    return merged;
  }

  private formatSingleEvent(parent: HTMLElement, event: SingleTimeEvent) {
    const date = this.transformer.formatter.formatDate(event.date);
    parent.createEl("h4", { cls: "tlv-date-title", text: date });
    const children = Array.from(event.content.childNodes);
    parent.append(...children);
  }

  private formatSpan(parent: HTMLElement, event: SpanTimeEvent) {
    const date = this.transformer.formatter.formatSpan(
      event.fromDate,
      event.toDate,
    );
    parent.createEl("h4", { cls: "tlv-date-title", text: date });
    const children = Array.from(event.content.childNodes);
    parent.append(...children);
  }

  private getPopoverPosition(marker: HTMLElement): { x: number; y: number } {
    const rect = marker.getBoundingClientRect();
    const x = rect.left + globalThis.scrollX;
    const y = rect.top + globalThis.scrollY + marker.offsetHeight;
    return { x, y };
  }
}
