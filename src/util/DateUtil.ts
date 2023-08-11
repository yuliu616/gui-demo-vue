import dayjs from 'dayjs';

export class DateUtil {

  /**
   * 
   * @param value could be dayjs.Dayjs, string of date, 
   * built-in Date or null(for now).
   * @param format 
   * @returns 
   */
  public static formatDate(value: any, format: string) {
    let d: dayjs.Dayjs;
    if (value === null) {
      // nothing, assume it is now()
      d= dayjs();
    } else if (typeof value == 'string') {
      d = dayjs(value);
    } else if (typeof value == 'object' && (typeof value.getYear) == 'function') {
      // JS Date
      d = dayjs(value);
    } else if (dayjs.isDayjs(value)) {
      d = value;
    } else {
      throw new Error('failed to determine date data-type.');
    }
    return d.format(format);
  }

  public static getAge(dateOfBirth: string, today?: string): number {
    let dob = (dayjs(dateOfBirth));
    let now = (today ? dayjs(today) : dayjs());
    let yearPassed = now.year() - dob.year();
    let currentYearBirthday = dob.year(now.year());
    if (dob.isAfter(now)) {
      // future born, just return as zero age.
      return 0;
    } else if (!now.isBefore(currentYearBirthday)){
      return yearPassed;
    } else {
      return yearPassed-1;
    }
  }

}
