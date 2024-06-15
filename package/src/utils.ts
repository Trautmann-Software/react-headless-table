import { BooleanFormatOptions, Column, ExtendedColumn, Row, SortingDirection } from './types';

export const noop = (): void => {
  return undefined;
};

export const defined = <T>(value: T | undefined | null): value is T => typeof value !== 'undefined' && value !== null;

export const equals = (a: Array<string>, b: Array<string>): boolean =>
  defined(a) && defined(b) && a.length === b.length && a.every((value, index) => b[index] === value);

export const getNextSortingDirection = (sortingDirection: SortingDirection): SortingDirection => {
  if (sortingDirection === 'asc') {
    return 'desc';
  } else if (sortingDirection === 'desc') {
    return undefined;
  } else {
    return 'asc';
  }
};

//#region Column['value']
export function builtInValueFn<RowData extends Record<string, any> = {}>(
  column: Column<RowData>
): ExtendedColumn<RowData>['value'] {
  return typeof column.value === 'function' ? column.value : (row: Row<RowData>) => row?.data?.[column.field];
}
//#endregion Column['value']

//#region Bigint
export const compareBigintValues = (a: bigint | undefined, b: bigint | undefined) => {
  const difference = (a ?? 0n) - (b ?? 0n);
  if (difference === 0n) {
    return 0;
  } else {
    return difference > 0n ? 1 : -1;
  }
};
//#endregion Bigint

//#region Date/Time
export const dateToNumber = (date: Date | undefined) =>
  defined(date)
    ? date.getFullYear() * 100_00 +
      (date.getFullYear() < 0 ? -1 : 1) * (date.getMonth() + 1) * 100 +
      (date.getFullYear() < 0 ? -1 : 1) * date.getDate()
    : 0;

export const compareDates = (a: Date | undefined, b: Date | undefined) => (
  dateToNumber(a ?? new Date('0000-01-01T00:00:00.000')) -
  dateToNumber(b ?? new Date('0000-01-01T00:00:00.000'))
);

export const timeToNumber = (time: Date | undefined) =>
  defined(time) ? time.getHours() * 100_00 + time.getMinutes() * 100 + time.getSeconds() : 0;

export const compareTimes = (a: Date | undefined, b: Date | undefined) => (
  timeToNumber(a ?? new Date('0000-01-01T00:00:00.000')) -
  timeToNumber(b ?? new Date('0000-01-01T00:00:00.000'))
);

export const datetimeToNumber = (datetime: Date | undefined) =>
  defined(datetime)
    ? datetime.getFullYear() * 100_00_00_00_00 +
      (datetime.getFullYear() < 0 ? -1 : 1) * (datetime.getMonth() + 1) * 100_00_00_00 +
      (datetime.getFullYear() < 0 ? -1 : 1) * datetime.getDate() * 100_00_00 +
      (datetime.getFullYear() < 0 ? -1 : 1) * datetime.getHours() * 100_00 +
      (datetime.getFullYear() < 0 ? -1 : 1) * datetime.getMinutes() * 100 +
      (datetime.getFullYear() < 0 ? -1 : 1) * datetime.getSeconds()
    : 0;

export const compareDateTimes = (a: Date | undefined, b: Date | undefined) => (
  datetimeToNumber(a ?? new Date('0000-01-01T00:00:00.000')) -
  datetimeToNumber(b ?? new Date('0000-01-01T00:00:00.000'))
);
//#endregion Date/Time

//#region Stringify
const generateForString = (value: string | undefined | null): string => (defined(value) ? value : '');

const generateForMultiString = (value: Array<string> | undefined | null): string =>
  defined(value) ? value.map(generateForString).join(', ') : '';

const generateForBoolean = (value: boolean | undefined | null, translations?: BooleanFormatOptions): string =>
  defined(translations)
    ? defined(value)
      ? value
        ? translations?.['true']
        : translations?.['false']
      : translations?.['empty']
    : '';

const generateForNumber = (
  value: number | undefined | null,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string => (defined(value) ? value.toLocaleString(locale, options) : '');

const generateForBigint = (
  value: bigint | undefined | null,
  locale?: string,
  options?: BigIntToLocaleStringOptions
): string => (defined(value) ? value.toLocaleString(locale, options) : '');

const generateForDate = (
  value: Date | undefined | null,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string => (defined(value) ? value.toLocaleDateString(locale, options) : '');

const generateForTime = (
  value: Date | undefined | null,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string => (defined(value) ? value.toLocaleTimeString(locale, options) : '');

const generateForDateTime = (
  value: Date | undefined | null,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string => (defined(value) ? value.toLocaleString(locale, options) : '');

const generateForRelativeTime = (
  value: number | undefined | null,
  unit?: Intl.RelativeTimeFormatUnit,
  formatter?: Intl.RelativeTimeFormat
): string => (defined(value) && defined(unit) && defined(formatter) ? formatter.format(value, unit) : '');

export type GenerateStringOptions = {
  locale?: string;
  numberFormatOptions?: Intl.NumberFormatOptions;
  bigintFormatOptions?: BigIntToLocaleStringOptions;
  dateFormatOptions?: Intl.DateTimeFormatOptions;
  timeFormatOptions?: Intl.DateTimeFormatOptions;
  dateTimeFormatOptions?: Intl.DateTimeFormatOptions;
  unit?: Intl.RelativeTimeFormatUnit;
  relativeTimeFormatter?: Intl.RelativeTimeFormat;
  booleanFormatOptions?: BooleanFormatOptions;
};

export function generateString<RowData extends Record<string, any> = {}>(
  row: Row<RowData>,
  column: Column<RowData>,
  options: GenerateStringOptions
) {
  switch (column.type) {
    case 'string':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForString(builtInValueFn(column)(row));
    case 'multi-string':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForMultiString(builtInValueFn(column)(row));
    case 'number':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForNumber(builtInValueFn(column)(row), options.locale, options.numberFormatOptions);
    case 'relative-time':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForRelativeTime(builtInValueFn(column)(row), options.unit, options.relativeTimeFormatter);
    case 'bigint':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForBigint(builtInValueFn(column)(row), options.locale, options.bigintFormatOptions);
    case 'date':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForDate(builtInValueFn(column)(row), options.locale, options.dateFormatOptions);
    case 'time':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForTime(builtInValueFn(column)(row), options.locale, options.timeFormatOptions);
    case 'date-time':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForDateTime(builtInValueFn(column)(row), options.locale, options.dateTimeFormatOptions);
    case 'boolean':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForBoolean(builtInValueFn(column)(row), options.booleanFormatOptions);
  }
}
//#endregion Stringify
