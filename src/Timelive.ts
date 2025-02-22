const DAYS_IN_YEAR = 365.2422;
const MILLIS_IN_DAY = 1000 * 3600 * 24;
const MILLIS_IN_YEAR = MILLIS_IN_DAY * DAYS_IN_YEAR;
const MIN_YEAR_WIDTH_IN_PX = 120;

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
    for (let year = fromYear; year <= toYear; year++) {
      yearsContainer.createSpan({ text: `${year}` });
    }
  }

  private renderLine() {
    const timelineLine = this.root.createDiv({ cls: "tlv-timeline" });
    if (this.minDate) {
      const highlight = timelineLine.createDiv({ cls: "tlv-timeline-highlight" });
      const start = this.calculatePosition(this.minDate);
      const width = this.calculatePosition(this.maxDate!) - start;
      highlight.style.left = `${start}%`;
      highlight.style.width = `${width}%`;
      const totalYearsWidth = MIN_YEAR_WIDTH_IN_PX * this.totalDays / DAYS_IN_YEAR;
      if (this.root.innerWidth < totalYearsWidth) {
        this.root.style.width = `${Math.floor(totalYearsWidth)}px`;
      }
    }
    this.events
      .map((e) => this.updatePosition(e))
      .sort((a, b) => a.position - b.position)
      // TODO: merge closest events
      .forEach((event) => {
        const marker = timelineLine.createDiv({ cls: "tlv-marker" });
        marker.style.left = `${event.position}%`;

        const popup = marker.createDiv({ cls: "tlv-popup popover hover-popover" });
        const date = event.date.toLocaleDateString();
        popup.innerHTML = `<h4 class="tlv-date-title">${date}</h4>` + event.content;
        marker.onmouseover = marker.ontouchstart = () => {
          popup.style.display = "block";
        };
        marker.onmouseout = marker.ontouchend = () => {
          popup.style.display = "none";
        };
      });
  }

  private updatePosition(event: TimeEvent): TimeEvent {
    event.position = this.calculatePosition(event.date);
    return event;
  }

  private calculatePosition(date: Date): number {
    const start = Math.floor(this.startDateTime / MILLIS_IN_YEAR) * MILLIS_IN_YEAR;
    const deltaDays = (date.getTime() - start) / MILLIS_IN_DAY;
    const value = (deltaDays / this.totalDays) * 100;
    // Round to 3 decimal points
    return Math.round(value * 1000) / 1000;
  }

  private parseDate(dateString: string): Date {
    // TODO: better date parsing
    if (/now|today|present/.test(dateString)) {
      return new Date();
    }
    return new Date(dateString);
  }
}
