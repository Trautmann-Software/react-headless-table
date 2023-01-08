import { createContext, PropsWithChildren, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Column, ExtendedColumn, Row, SortingDirection, UseColumns } from '../types';
import {
  datetimeToNumber,
  dateToNumber,
  defined,
  generateString,
  GenerateStringOptions,
  getNextSortingDirection,
  noop,
  timeToNumber,
  builtInValueFn,
} from '../utils';
import { useOptions } from '../hooks/use-options';

/**
 * @template RowData is the generic row type.
 * @template CustomColumn is the additional type definitions for the column.
 */
export type ColumnContextProps<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {}
> = UseColumns<RowData, CustomColumn>;

export const ColumnContext = createContext<ColumnContextProps>({
  columns: [],
  hideColumn: noop,
  showColumn: noop,
  toggleColumnVisibility: noop,
  swapColumnOrder: noop,
  sort: noop,
  toggleSort: noop,
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
  const deferredPassedColumns = useDeferredValue(passedColumns);

  const [columns, setColumns] = useState<Array<ExtendedColumn<RowData, CustomColumn>>>([]);

  //#region Extend columns
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
    (
      column: Column<RowData, CustomColumn>
    ) => (a: Row<RowData>, b: Row<RowData>, sortingDirection: SortingDirection) => number
  >(
    (column) => {
      return (a, b, sortingDirection) => {
        if (!defined(sortingDirection)) {
          return 0;
        }
        const directionMultiplicative = sortingDirection === 'asc' ? 1 : -1;
        switch (column.type) {
          case 'string':
          case 'multi-string':
          case 'boolean':
            return (
              directionMultiplicative *
              compareStrings(
                generateString(a, column, generateStringOptions(column)),
                generateString(b, column, generateStringOptions(column))
              )
            );
          case 'number':
          case 'relative-time':
            // eslint-disable-next-line
            // @ts-ignore
            return directionMultiplicative * ((builtInValueFn(column)(a) ?? 0) - (builtInValueFn(column)(b) ?? 0));
          case 'bigint':
            // eslint-disable-next-line
            // @ts-ignore
            const difference = (builtInValueFn(column)(a) ?? 0n) - (builtInValueFn(column)(b) ?? 0n);
            return difference === 0n ? 0 : directionMultiplicative * (difference > 0n ? 1 : -1);
          case 'date':
            return (
              directionMultiplicative *
              // eslint-disable-next-line
              // @ts-ignore
              (dateToNumber(builtInValueFn(column)(a)) - dateToNumber(builtInValueFn(column)(b)))
            );
          case 'time':
            return (
              directionMultiplicative *
              // eslint-disable-next-line
              // @ts-ignore
              (timeToNumber(builtInValueFn(column)(a)) - timeToNumber(builtInValueFn(column)(b)))
            );
          case 'date-time':
            return (
              directionMultiplicative *
              // eslint-disable-next-line
              // @ts-ignore
              (datetimeToNumber(builtInValueFn(column)(a)) - datetimeToNumber(builtInValueFn(column)(b)))
            );
          default:
            return 0;
        }
      };
    },
    [compareStrings, generateStringOptions]
  );
  const extendColumn = useCallback<
    (column: Column<RowData, CustomColumn>, order: number) => ExtendedColumn<RowData, CustomColumn>
  >(
    (column, order) =>
      ({
        ...(column as ExtendedColumn<RowData, {}>),
        id: column.id ?? String(column.field),
        value: builtInValueFn(column),
        hidden: column.hidden ?? false,
        searchable: column.searchable ?? true,
        searchFn: column.searchFn ?? builtInSearchFn({ ...column, value: builtInValueFn(column) }),
        sortingDirection: column.sortingDirection ?? undefined,
        sortFn: column.sortFn ?? builtInSortFn({ ...column, value: builtInValueFn(column) }),
        order: column.order ?? order,
      } as ExtendedColumn<RowData, CustomColumn>),
    [builtInSearchFn, builtInSortFn]
  );

  useEffect(
    () =>
      setColumns(
        deferredPassedColumns.map((column, index) => extendColumn(column, index)).sort((a, b) => a.order - b.order)
      ),
    [deferredPassedColumns, extendColumn]
  );
  //#endregion Extend columns

  //#region Column re-ordering
  const swapColumnOrder = useCallback<UseColumns<RowData, CustomColumn>['swapColumnOrder']>(
    (columnId1, columnId2) =>
      setColumns((previousColumns) => {
        const order1 = previousColumns.find((column) => column.id === columnId1)?.order as number;
        const order2 = previousColumns.find((column) => column.id === columnId2)?.order as number;
        return previousColumns
          .map<ExtendedColumn<RowData, CustomColumn>>((column) => {
            if (column.id === columnId1) {
              return { ...column, order: order2 };
            } else if (column.id === columnId2) {
              return { ...column, order: order1 };
            } else return column;
          })
          .sort((a, b) => a.order - b.order);
      }),
    []
  );
  //#endregion Column re-ordering

  //#region Column visibility
  const hideColumn = useCallback<UseColumns<RowData, CustomColumn>['hideColumn']>(
    (columnId) =>
      setColumns((previousColumns) =>
        previousColumns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                hidden: true,
              }
            : column
        )
      ),
    []
  );
  const showColumn = useCallback<UseColumns<RowData, CustomColumn>['showColumn']>(
    (columnId) =>
      setColumns((currentColumns) =>
        currentColumns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                hidden: false,
              }
            : column
        )
      ),
    []
  );
  const toggleColumnVisibility = useCallback<UseColumns<RowData, CustomColumn>['toggleColumnVisibility']>(
    (columnId) =>
      setColumns((currentColumns) =>
        currentColumns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                hidden: !column.hidden,
              }
            : column
        )
      ),
    []
  );
  //#endregion Column visibility

  //#region Sorting Direction
  const sort = useCallback<UseColumns<RowData, CustomColumn>['sort']>(
    (columnId, sortingDirection) =>
      setColumns((previousColumns) =>
        previousColumns.map((column) =>
          column.id === columnId ? { ...column, sortingDirection } : { ...column, sortingDirection: undefined }
        )
      ),
    []
  );
  const toggleSort = useCallback<UseColumns<RowData, CustomColumn>['toggleSort']>(
    (columnId) =>
      setColumns((previousColumns) =>
        previousColumns.map((column) =>
          column.id === columnId
            ? { ...column, sortingDirection: getNextSortingDirection(column.sortingDirection) }
            : { ...column, sortingDirection: undefined }
        )
      ),
    []
  );
  //#endregion Sorting Direction

  return useMemo(
    () => (
      <ColumnContext.Provider
        value={{
          // eslint-disable-next-line
          // @ts-ignore
          columns,
          hideColumn,
          showColumn,
          toggleColumnVisibility,
          swapColumnOrder,
          sort,
          toggleSort,
        }}
      >
        {children}
      </ColumnContext.Provider>
    ),
    [children, columns, hideColumn, showColumn, sort, swapColumnOrder, toggleColumnVisibility, toggleSort]
  );
}
