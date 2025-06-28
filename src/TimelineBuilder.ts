import type { Moment } from "moment";

const DAYS_IN_YEAR = 365.2422;

export type TimeSpan = { min?: Moment; max?: Moment };
export type YearRange = { fromYear: number; toYear: number };

export interface TimelineBuilder {
  addDate(date: Moment): void;

  getActualTimeSpan(): TimeSpan;
  getYearRange(): YearRange;

  calculatePosition(date: Moment): number;
}

export class DynamicTimelineBuilder implements TimelineBuilder {
  private actualSpan: TimeSpan = {};
  private startOfYear?: Moment;
  private deltaYears = 0.0;

  addDate(date: Moment): void {
    const time = date.valueOf();
    if (!this.actualSpan.min || !this.actualSpan.max) {
      this.actualSpan.min = date;
      this.actualSpan.max = date;
      this.startOfYear = date.clone().startOf("year");
    } else {
      const { min, max } = this.actualSpan;
      if (time < min.valueOf()) {
        this.actualSpan.min = date;
        this.startOfYear = date.clone().startOf("year");
      } else if (time > max.valueOf()) {
        this.actualSpan.max = date;
      } else return; // no updates to min/max dates -> skip
      this.deltaYears = 1 + this.actualSpan.max.diff(this.startOfYear, "years");
    }
  }

  getActualTimeSpan(): TimeSpan {
    return this.actualSpan;
  }

  getYearRange(): YearRange {
    const fromYear = this.getFromYear();
    return {
      fromYear: fromYear,
      toYear: 1 + (this.actualSpan.max?.year() ?? fromYear),
    };
  }

  calculatePosition(date: Moment): number {
    const deltaDays = date.diff(this.startOfYear, "days");
    const totalDays = this.deltaYears * DAYS_IN_YEAR;
    const value = (deltaDays / totalDays) * 100;
    // Round to 3 decimal points
    return Math.round(value * 1000) / 1000;
  }

  private getFromYear(): number {
    return this.startOfYear?.year() ?? (new Date().getFullYear());
  }
}
