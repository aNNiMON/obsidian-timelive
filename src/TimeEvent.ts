import type { Moment } from "moment";

export enum TimeEventType {
  Single = "single",
  Span = "span",
}

export interface TimeEvent {
  content: HTMLElement;
  type: TimeEventType;
}

export interface SingleTimeEvent extends TimeEvent {
  date: Moment;
  position: number;
  type: TimeEventType.Single;
}

export interface SpanTimeEvent extends TimeEvent {
  fromDate: Moment;
  toDate: Moment;
  position: number;
  width: number;
  type: TimeEventType.Span;
}
