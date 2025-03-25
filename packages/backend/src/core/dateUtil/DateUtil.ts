class DateUtil {
  private static instance: DateUtil;

  private constructor() {}

  public static getInstance(): DateUtil {
    if (!DateUtil.instance) {
      DateUtil.instance = new DateUtil();
    }
    return DateUtil.instance;
  }

  validateDate(date: Date | string): void {
    if (date === null || date === undefined) {
      throw new Error('Date input cannot be null or undefined');
    }

    if (typeof date !== 'string' && !(date instanceof Date)) {
      throw new Error(`Invalid input type. Expected string or Date, received ${typeof date}`);
    }

    if (typeof date === 'string' && date.trim() === '') {
      throw new Error('Date string cannot be empty');
    }

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date format: "${date}". Please provide a valid date string or Date object`);
    }
  }

  getCurrentDateInUTC() {
    return this.toUTCDate(new Date());
  }

  toISOString(date: Date | string): string {
    this.validateDate(date);
    const parsedDate = new Date(date);
    return parsedDate.toISOString();
  }

  toUTCDate(date: Date | string): Date {
    this.validateDate(date);

    const parsedDate = new Date(date);

    return new Date(
      Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate(),
        parsedDate.getUTCHours(),
        parsedDate.getUTCMinutes(),
        parsedDate.getUTCSeconds(),
        parsedDate.getUTCMilliseconds()
      )
    );
  }
}

export default DateUtil;
