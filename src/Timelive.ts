const DAYS_IN_YEAR = 365.2422;
const MILLIS_IN_DAY = 1000 * 3600 * 24;
const MILLIS_IN_YEAR = MILLIS_IN_DAY * DAYS_IN_YEAR;

interface TimeEvent {
  date: Date;
  content: string;
  position: number;
}

export class Timelive {
  private root: HTMLElement;
  private events: TimeEvent[] = [];
  // For timeline computation
  private minDate?: Date;
  private maxDate?: Date;
  private startDateTime: number = 0;
  private totalDays: number = 0;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  public addEvent(dateString: string, content: string) {
    const date = this.parseDate(dateString.toLowerCase());
    this.events.push({ date, content, position: 0 });
    // Recalculate min/max dates
    const time = date.getTime();
    if (!this.minDate) {
      this.minDate = date;
      this.maxDate = date;
      this.startDateTime = time;
    } else {
      if (time < this.minDate.getTime()) {
        this.minDate = date;
        this.startDateTime = time;
      } else if (time > this.maxDate!.getDate()) {
        this.maxDate = date;
      } else return; // no updates to min/max dates -> skip
    }
    // Recalculate total days
    const deltaYears = 1 + this.maxDate!.getFullYear() - this.minDate.getFullYear();
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
    const fromYear = this.minDate?.getFullYear() ?? (new Date().getFullYear());
    const toYear = 1 + (this.maxDate?.getFullYear() ?? fromYear);
    const years: Set<number> = this.splitYears(new Set<number>(), fromYear, toYear, 0);
    [...years]
      .sort()
      .forEach((year) => yearsContainer.createSpan({ text: `${year}` }));
  }

  private renderLine() {
    const timelineLine = this.root.createDiv({ cls: "tlv-timeline" });
    if (this.minDate) {
      const highlight = timelineLine.createDiv({ cls: "tlv-timeline-highlight" });
      const start = this.calculatePosition(this.minDate);
      const width = this.calculatePosition(this.maxDate!) - start;
      highlight.style.left = `${start}%`;
      highlight.style.width = `${width}%`;
    }
    this.mergeClosestEvents(this.events)
      .forEach((event) => {
        const marker = timelineLine.createDiv({ cls: "tlv-marker" });
        marker.style.left = `${event.position}%`;

        const popup = marker.createDiv({ cls: "tlv-popup popover hover-popover" });
        popup.innerHTML = this.formatEvent(event);
        marker.onmouseover = marker.ontouchstart = () => {
          popup.style.display = "block";
        };
        marker.onmouseout = marker.ontouchend = () => {
          popup.style.display = "none";
        };
      });
  }

  private mergeClosestEvents(events: TimeEvent[]): TimeEvent[] {
    const CLOSEST_DELTA = 1; // %
    const merged: TimeEvent[] = [];
    let lastPosition: number;
    events
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .forEach((event, i) => {
        event.position = this.calculatePosition(event.date);
        if (i > 0 && (event.position - lastPosition) < CLOSEST_DELTA) {
          merged[merged.length - 1].content += this.formatEvent(event, "<hr/>");
        } else {
          lastPosition = event.position;
          merged.push(event);
        }
      });
    return merged;
  }

  private formatEvent(event: TimeEvent, before: string = ""): string {
    const date = event.date.toLocaleDateString();
    return before +
      `<h4 class="tlv-date-title">${date}</h4>` +
      event.content;
  }

  private calculatePosition(date: Date): number {
    const start = Math.floor(this.startDateTime / MILLIS_IN_YEAR) * MILLIS_IN_YEAR;
    const deltaDays = (date.getTime() - start) / MILLIS_IN_DAY;
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

  private parseDate(dateString: string): Date {
    // TODO: better date parsing
    if (/now|today|present/.test(dateString)) {
      return new Date();
    }
    return new Date(dateString);
  }
}
