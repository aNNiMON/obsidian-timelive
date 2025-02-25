export interface DateFormatter {
  formatDate(date: Date): string;
}

export class TimeliveDateFormatter implements DateFormatter {
  public formatDate(date: Date): string {
    return date.toDateString();
  }
}
