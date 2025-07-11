import type { Moment } from "moment";
import { TIME_UNITS, TimeUnit } from "./TimeUnit.ts";

export type TimeSpan = { min?: Moment; max?: Moment; unit: TimeUnit };
export type CalendarDates = {
  dates: Set<Moment>;
  unit: TimeUnit;
};

export interface TimelineBuilder {
  addDate(date: Moment): void;

  getActualTimeSpan(): TimeSpan;
  getCalendarTimeSpan(): TimeSpan;

  buildCalendarDates(): CalendarDates;
  calculatePosition(date: Moment): number;
}

export class DynamicTimelineBuilder implements TimelineBuilder {
  private actualSpan: TimeSpan = { unit: TimeUnit.Month };
  private startOfUnit?: Moment;
  private deltaInUnit = 0.0;

  addDate(date: Moment): void {
    const time = date.valueOf();
    const { min, max, unit } = this.actualSpan;
    if (!min || !max) {
      this.actualSpan.min = date;
      this.actualSpan.max = date;
      this.startOfUnit = date.clone().startOf(unit);
    } else {
      if (time < min.valueOf()) {
        this.actualSpan.min = date;
        this.startOfUnit = date.clone().startOf(unit);
      } else if (time > max.valueOf()) {
        this.actualSpan.max = date;
      } else return; // no updates to min/max dates -> skip

      const newUnit = this.determineUnit();
      if (newUnit !== unit) {
        this.actualSpan.unit = newUnit;
        this.startOfUnit = this.actualSpan.min!.clone().startOf(newUnit);
      }
      this.deltaInUnit = 1 + this.actualSpan.max!.diff(this.startOfUnit, this.actualSpan.unit);
    }
  }

  getActualTimeSpan(): TimeSpan {
    return this.actualSpan;
  }

  getCalendarTimeSpan(): TimeSpan {
    const { min, max, unit } = this.actualSpan;
    const start = (min?.clone() ?? this.now()).startOf(unit);
    return {
      min: start,
      max: (max ?? start).clone().add(1, unit),
      unit,
    };
  }

  calculatePosition(date: Moment): number {
    const unit = this.actualSpan.unit;
    const deltaDays = date.diff(this.startOfUnit, "days");
    const totalDays = this.deltaInUnit * TIME_UNITS[unit].daysInUnit;
    const value = (deltaDays / totalDays) * 100;
    // Round to 3 decimal points
    return Math.round(value * 1000) / 1000;
  }

  buildCalendarDates(): CalendarDates {
    const { min, max, unit } = this.getCalendarTimeSpan();
    const dates = this.splitDates(new Set<Moment>(), min!, max!, unit, 0);
    return { dates, unit };
  }

  // Recursively split dates for building a calendar
  private splitDates(
    dates: Set<Moment>,
    a: Moment,
    b: Moment,
    unit: TimeUnit,
    level: number,
  ): Set<Moment> {
    if (level < 3 && !this.datesMatchInUnit(a, b, unit)) {
      dates.add(a).add(b);
      const mid = a.clone().add(b.diff(a, unit, true) / 2, unit);
      this.splitDates(dates, a, mid, unit, level + 1);
      this.splitDates(dates, mid, b, unit, level + 1);
    }
    return dates;
  }

  private datesMatchInUnit(a: Moment, b: Moment, unit: TimeUnit): boolean {
    if (unit === TimeUnit.Year) {
      return a.year() === b.year();
    } else {
      return a.year() === b.year() && a.month() === b.month();
    }
  }

  private determineUnit(): TimeUnit {
    const { min, max } = this.actualSpan;
    if (!min || !max) return TimeUnit.Month;
    const deltaMonths = max.diff(min, "months");
    if (deltaMonths <= 10) return TimeUnit.Month;
    return TimeUnit.Year;
  }

  private now(): Moment {
    // @ts-ignore: deno lack of type
    const moment: MomentCallable = globalThis.moment;
    return moment();
  }
}
