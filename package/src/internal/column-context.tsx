import { createContext, PropsWithChildren, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Column, ExtendedColumn, Row } from '../types';
import {
  datetimeToNumber,
  dateToNumber,
  generateString,
  GenerateStringOptions,
  timeToNumber,
  untypedValueFn,
  valueFn,
} from '../utils';
import { useOptions } from '../hooks/use-options';

/**
 * @template RowData is the generic row type.
 * @template CustomColumn is the additional type definitions for the column.
 */
export type ColumnContextProps<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {}
> = {
  columns: Array<ExtendedColumn<RowData, CustomColumn>>;
};

export const ColumnContext = createContext<ColumnContextProps>({
  columns: [],
});

type Props<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {}
> = PropsWithChildren<{
  columns: Array<Column<RowData, CustomColumn>>;
}>;

/**
 * @template RowData is the generic row type.
 * @template CustomColumn is the additional type definitions for the column.
 */
export function ColumnContextProvider<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {}
>(props: Props<RowData, CustomColumn>) {
  const { children, columns: passedColumns } = props;
  const [columns, setColumns] = useState<Array<ExtendedColumn<RowData, CustomColumn>>>([]);

  const { internationalizationOptions } = useOptions<{}, CustomColumn, RowData>();
  const generateStringOptions = useCallback<(column: Column<RowData, CustomColumn>) => GenerateStringOptions>(
    (column) => ({
      locale: internationalizationOptions.locale,
      numberFormatOptions:
        column.type === 'number' ? column.formatOptions ?? internationalizationOptions.numberFormatOptions : undefined,
      bigintFormatOptions:
        column.type === 'bigint' ? column.formatOptions ?? internationalizationOptions.bigintFormatOptions : undefined,
      dateFormatOptions:
        column.type === 'date' ? column.formatOptions ?? internationalizationOptions.dateFormatOptions : undefined,
      timeFormatOptions:
        column.type === 'time' ? column.formatOptions ?? internationalizationOptions.timeFormatOptions : undefined,
      dateTimeFormatOptions:
        column.type === 'date-time'
          ? column.formatOptions ?? internationalizationOptions.dateTimeFormatOptions
          : undefined,
      unit: column.type === 'relative-time' ? column.relativeTimeFormatUnit : undefined,
      relativeTimeFormatter:
        column.type === 'relative-time'
          ? new Intl.RelativeTimeFormat(
              internationalizationOptions.locale,
              column.formatOptions ?? internationalizationOptions.relativeTimeFormatOptions
            )
          : undefined,
      booleanFormatOptions:
        column.type === 'boolean'
          ? column.formatOptions ?? internationalizationOptions.booleanFormatOptions
          : undefined,
    }),
    [
      internationalizationOptions.bigintFormatOptions,
      internationalizationOptions.booleanFormatOptions,
      internationalizationOptions.dateFormatOptions,
      internationalizationOptions.dateTimeFormatOptions,
      internationalizationOptions.locale,
      internationalizationOptions.numberFormatOptions,
      internationalizationOptions.relativeTimeFormatOptions,
      internationalizationOptions.timeFormatOptions,
    ]
  );
  const builtInSearchFn = useCallback(
    (column: Column<RowData, CustomColumn>) => (term: string, row: Row<RowData>) =>
      generateString(row, column, generateStringOptions(column))
        .toLocaleLowerCase(internationalizationOptions.locale)
        .includes(term.toLocaleLowerCase(internationalizationOptions.locale)),
    [generateStringOptions, internationalizationOptions.locale]
  );
  const compareStrings = useMemo(
    () => new Intl.Collator(internationalizationOptions.locale, internationalizationOptions.collatorOptions).compare,
    [internationalizationOptions.collatorOptions, internationalizationOptions.locale]
  );
  const builtInSortFn = useCallback<
    (column: Column<RowData, CustomColumn>) => (a: Row<RowData>, b: Row<RowData>) => number
  >(
    (column) => (a, b) => {
      switch (column.type) {
        case 'string':
        case 'multi-string':
        case 'boolean':
          return compareStrings(
            generateString(a, column, generateStringOptions(column)),
            generateString(b, column, generateStringOptions(column))
          );
        case 'number':
        case 'relative-time':
          return (valueFn(column.type, column.value)(a) ?? 0) - (valueFn(column.type, column.value)(b) ?? 0);
        case 'bigint':
          const difference =
            (valueFn(column.type, column.value)(a) ?? 0n) - (valueFn(column.type, column.value)(b) ?? 0n);
          return difference === 0n ? 0 : difference > 0n ? 1 : -1;
        case 'date':
          return (
            dateToNumber(valueFn(column.type, column.value)(a) ?? new Date('0000-01-01')) -
            dateToNumber(valueFn(column.type, column.value)(b) ?? new Date('0000-01-01'))
          );
        case 'time':
          return (
            timeToNumber(valueFn(column.type, column.value)(a) ?? new Date('0000-01-01')) -
            timeToNumber(valueFn(column.type, column.value)(b) ?? new Date('0000-01-01'))
          );
        case 'date-time':
          return (
            datetimeToNumber(valueFn(column.type, column.value)(a) ?? new Date('0000-01-01')) -
            datetimeToNumber(valueFn(column.type, column.value)(b) ?? new Date('0000-01-01'))
          );
        default:
          return 0;
      }
    },
    [compareStrings, generateStringOptions]
  );

  const deferredColumns = useDeferredValue(passedColumns);
  const extendedColumns = useMemo<Array<ExtendedColumn<RowData, CustomColumn>>>(
    () =>
      deferredColumns.map((column, index) => ({
        ...(column as Column<RowData, CustomColumn>),
        id: column.id ?? column.field,
        value: untypedValueFn(column),
        hidden: column.hidden ?? false,
        searchable: column.searchable ?? true,
        searchFn: column.searchFn ?? builtInSearchFn(column),
        filterable: column.filterable ?? true,
        sortFn: column.sortFn ?? builtInSortFn(column),
        order: column.order ?? index,
      })) as Array<ExtendedColumn<RowData, CustomColumn>>,
    [builtInSearchFn, builtInSortFn, deferredColumns]
  );
  const deferredExtendedColumns = useDeferredValue(extendedColumns);
  useEffect(() => setColumns(deferredExtendedColumns), [deferredExtendedColumns]);

  return useMemo(
    () => (
      <ColumnContext.Provider
        // eslint-disable-next-line
        // @ts-ignore
        value={{ columns }}
      >
        {children}
      </ColumnContext.Provider>
    ),
    [children, columns]
  );
}
