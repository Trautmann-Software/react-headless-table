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
export function valueFn<RowData extends Record<string, any> = {}>(
  columnType: 'date' | 'time' | 'date-time',
  columnValueFn?: (row: Row<RowData>) => Date | undefined
): (row: Row<RowData>) => Date | undefined;
export function valueFn<RowData extends Record<string, any> = {}>(
  columnType: 'number' | 'relative-time',
  columnValueFn?: (row: Row<RowData>) => number | undefined
): (row: Row<RowData>) => number | undefined;
export function valueFn<RowData extends Record<string, any> = {}>(
  columnType: 'bigint',
  columnValueFn?: (row: Row<RowData>) => bigint | undefined
): (row: Row<RowData>) => bigint | undefined;
export function valueFn<RowData extends Record<string, any> = {}>(
  columnType: 'boolean',
  columnValueFn?: (row: Row<RowData>) => boolean | undefined
): (row: Row<RowData>) => boolean | undefined;
export function valueFn<RowData extends Record<string, any> = {}>(
  columnType: 'string',
  columnValueFn?: (row: Row<RowData>) => string | undefined
): (row: Row<RowData>) => string | undefined;
export function valueFn<RowData extends Record<string, any> = {}>(
  columnType: 'multi-string',
  columnValueFn?: (row: Row<RowData>) => Array<string> | undefined
): (row: Row<RowData>) => Array<string> | undefined;
export function valueFn<RowData extends Record<string, any> = {}>(
  columnType: Column<RowData>['type'],
  columnValueFn?: Column<RowData>['value']
): ExtendedColumn<RowData>['value'] {
  switch (columnType) {
    case 'string':
      return (row: Row<RowData>) =>
        (typeof columnValueFn === 'function' ? columnValueFn(row) : undefined) as string | undefined;
    case 'multi-string':
      return (row: Row<RowData>) =>
        (typeof columnValueFn === 'function' ? columnValueFn(row) : undefined) as Array<string> | undefined;
    case 'number':
    case 'relative-time':
      return (row: Row<RowData>) =>
        (typeof columnValueFn === 'function' ? columnValueFn(row) : undefined) as number | undefined;
    case 'bigint':
      return (row: Row<RowData>) =>
        (typeof columnValueFn === 'function' ? columnValueFn(row) : undefined) as bigint | undefined;
    case 'date':
    case 'time':
    case 'date-time':
      return (row: Row<RowData>) =>
        (typeof columnValueFn === 'function' ? columnValueFn(row) : undefined) as Date | undefined;
    case 'boolean':
      return (row: Row<RowData>) =>
        (typeof columnValueFn === 'function' ? columnValueFn(row) : undefined) as boolean | undefined;
  }
}

export function untypedValueFn<RowData extends Record<string, any> = {}>(
  column: Column<RowData>
): ExtendedColumn<RowData>['value'] {
  return typeof column.value === 'function' ? column.value : (row: Row<RowData>) => row?.data?.[column.field];
}

/*export const valueFn = <ColumnType extends Column<RowData>, RowData extends Record<string, any> = {}>(column: Column<RowData>):
  ColumnType extends ('date' | 'time' | 'date-time') ? ((row: Row<RowData>) => Date | undefined) : (
    ColumnType extends ('number' | 'relative-time') ? ((row: Row<RowData>) => number | undefined) : (
      ColumnType extends ('bigint') ? ((row: Row<RowData>) => bigint | undefined) : (
        ColumnType extends ('boolean') ? ((row: Row<RowData>) => boolean | undefined) : (
          ColumnType extends ('multi-string') ? ((row: Row<RowData>) => Array<string> | undefined) : (
            (row: Row<RowData>) => string | undefined
          )
        )
      )
    )
  ) => (row: Row<RowData>) => (typeof column.value === 'function'
  ? column.value(row)
  : rowA.data?.[column.field as keyof RowData]);*/
//#endregion Column['value']

//#region Date/Time
export const dateToNumber = (date: Date | undefined) =>
  defined(date)
    ? date.getFullYear() * 100_00 +
      (date.getFullYear() < 0 ? -1 : 1) * (date.getMonth() + 1) * 100 +
      (date.getFullYear() < 0 ? -1 : 1) * date.getDate()
    : 0;

export const timeToNumber = (time: Date | undefined) =>
  defined(time) ? time.getHours() * 100_00 + time.getMinutes() * 100 + time.getSeconds() : 0;

export const datetimeToNumber = (datetime: Date | undefined) =>
  defined(datetime)
    ? datetime.getFullYear() * 100_00_00_00_00 +
      (datetime.getFullYear() < 0 ? -1 : 1) * (datetime.getMonth() + 1) * 100_00_00_00 +
      (datetime.getFullYear() < 0 ? -1 : 1) * datetime.getDate() * 100_00_00 +
      (datetime.getFullYear() < 0 ? -1 : 1) * datetime.getHours() * 100_00 +
      (datetime.getFullYear() < 0 ? -1 : 1) * datetime.getMinutes() * 100 +
      (datetime.getFullYear() < 0 ? -1 : 1) * datetime.getSeconds()
    : 0;
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
      return generateForString(untypedValueFn(column)(row));
    case 'multi-string':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForMultiString(untypedValueFn(column)(row));
    case 'number':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForNumber(untypedValueFn(column)(row), options.locale, options.numberFormatOptions);
    case 'relative-time':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForRelativeTime(untypedValueFn(column)(row), options.unit, options.relativeTimeFormatter);
    case 'bigint':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForBigint(untypedValueFn(column)(row), options.locale, options.bigintFormatOptions);
    case 'date':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForDate(untypedValueFn(column)(row), options.locale, options.dateFormatOptions);
    case 'time':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForTime(untypedValueFn(column)(row), options.locale, options.timeFormatOptions);
    case 'date-time':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForDateTime(untypedValueFn(column)(row), options.locale, options.dateTimeFormatOptions);
    case 'boolean':
      // eslint-disable-next-line
      // @ts-ignore
      return generateForBoolean(untypedValueFn(column)(row), options.booleanFormatOptions);
  }
}
//#endregion Stringify
