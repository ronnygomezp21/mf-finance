import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';

type FormatDate = 'year' | 'month' | 'day';
@Injectable({
  providedIn: 'root',
})
export class DayJSService {
  constructor() {
    dayjs.extend(isBetween);
    dayjs.extend(isSameOrAfter);
    dayjs.extend(isSameOrBefore);
    dayjs.extend(isToday);
    dayjs.extend(isTomorrow);
  }

  isBetween(
    current: string,
    rangeA: string,
    rangeB: string,
    format: FormatDate = 'year',
  ) {
    return dayjs(current).isBetween(rangeA, dayjs(rangeB), format);
  }

  isSameOrAfter(current: string, limit: string, format: FormatDate) {
    return dayjs(current).isSameOrAfter(limit, format);
  }

  isSameOrBefore(current: string, limit: string, format: dayjs.OpUnitType) {
    return dayjs(current).isSameOrBefore(limit, format);
  }

  format(date?: string, format: string = 'YYYY-MM-DD') {
    if (date) {
      return dayjs(date).format(format);
    }
    return dayjs().format(format);
  }

  dayJs() {
    return dayjs;
  }
}
