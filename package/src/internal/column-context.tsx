import {
  createContext,
  PropsWithChildren,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { Column, ExtendedColumn, Row, UseColumns } from '../types';
import {
  datetimeToNumber,
  dateToNumber,
  generateString,
  GenerateStringOptions,
  noop,
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
> = UseColumns<RowData, CustomColumn>;

export const ColumnContext = createContext<ColumnContextProps>({
  columns: [],
  hideColumn: noop,
  showColumn: noop,
  toggleColumnVisibility: noop,
  isColumnVisibilityChangePending: false,
  swapColumnOrder: noop,
  isSwapColumnOrderPending: false,
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
            dateToNumber(valueFn(column.type, column.value)(a)) - dateToNumber(valueFn(column.type, column.value)(b))
          );
        case 'time':
          return (
            timeToNumber(valueFn(column.type, column.value)(a)) - timeToNumber(valueFn(column.type, column.value)(b))
          );
        case 'date-time':
          return (
            datetimeToNumber(valueFn(column.type, column.value)(a)) -
            datetimeToNumber(valueFn(column.type, column.value)(b))
          );
        default:
          return 0;
      }
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
        value: untypedValueFn(column),
        hidden: column.hidden ?? false,
        searchable: column.searchable ?? true,
        searchFn: column.searchFn ?? builtInSearchFn(column),
        filterable: column.filterable ?? true,
        sortFn: column.sortFn ?? builtInSortFn(column),
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
  const [isSwapColumnOrderPending, startSwapColumnOrderTransition] = useTransition();
  const swapColumnOrder = useCallback<UseColumns<RowData, CustomColumn>['swapColumnOrder']>((columnId1, columnId2) => {
    startSwapColumnOrderTransition(() => {
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
      });
    });
  }, []);
  //#endregion Column re-ordering

  //#region Column visibility
  const [isColumnVisibilityChangePending, startColumnVisibilityChangeTransition] = useTransition();
  const hideColumn = useCallback<UseColumns<RowData, CustomColumn>['hideColumn']>((columnId) => {
    startColumnVisibilityChangeTransition(() => {
      setColumns((previousColumns) =>
        previousColumns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                hidden: true,
              }
            : column
        )
      );
    });
  }, []);
  const showColumn = useCallback<UseColumns<RowData, CustomColumn>['showColumn']>((columnId) => {
    startColumnVisibilityChangeTransition(() => {
      setColumns((currentColumns) =>
        currentColumns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                hidden: false,
              }
            : column
        )
      );
    });
  }, []);
  const toggleColumnVisibility = useCallback<UseColumns<RowData, CustomColumn>['toggleColumnVisibility']>(
    (columnId) => {
      startColumnVisibilityChangeTransition(() => {
        setColumns((currentColumns) =>
          currentColumns.map((column) =>
            column.id === columnId
              ? {
                  ...column,
                  hidden: !column.hidden,
                }
              : column
          )
        );
      });
    },
    []
  );
  //#endregion Column visibility

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
          isSwapColumnOrderPending,
          swapColumnOrder,
          isColumnVisibilityChangePending,
        }}
      >
        {children}
      </ColumnContext.Provider>
    ),
    [
      children,
      columns,
      hideColumn,
      isColumnVisibilityChangePending,
      isSwapColumnOrderPending,
      showColumn,
      swapColumnOrder,
      toggleColumnVisibility,
    ]
  );
}
