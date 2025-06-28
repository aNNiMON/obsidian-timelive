export enum TimeUnit {
  Month = "month",
  Year = "year",
}
type TimeUnitData = {
  daysInUnit: number;
};

export const TIME_UNITS: Record<TimeUnit, TimeUnitData> = {
  [TimeUnit.Month]: {
    daysInUnit: 31,
  },
  [TimeUnit.Year]: {
    daysInUnit: 365.2422,
  },
};
