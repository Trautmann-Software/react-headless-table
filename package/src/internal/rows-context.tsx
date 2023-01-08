import { createContext, PropsWithChildren, useCallback, useDeferredValue, useMemo } from 'react';
import { Row, UseRows } from '../types';
import { useColumns, useSearchQuery } from '../hooks';
import { useOptions } from '../hooks/use-options';
import { useFilters } from '../hooks/use-filters';
import { defined } from '../utils';

export type RowsContextProps<RowData extends Record<string, any> = {}> = UseRows<RowData>;

export const RowsContext = createContext<RowsContextProps>({
  rows: [],
});

type Props<RowData extends Record<string, any> = {}> = PropsWithChildren<{
  rows: Array<RowData>;
}>;

export function RowsContextProvider<RowData extends Record<string, any> = {}>(props: Props<RowData>) {
  const { children, rows: passedRows } = props;
  const deferredPassedRows = useDeferredValue(passedRows);
  const {
    rowOptions: { idFn: generateId },
  } = useOptions<{}, {}, RowData>();
  const extendRow = useCallback<(rowData: RowData) => Row<RowData>>(
    (rowData) => ({
      id: generateId(rowData),
      data: rowData,
    }),
    [generateId]
  );
  const extendedRows = useMemo(() => deferredPassedRows.map(extendRow), [deferredPassedRows, extendRow]);

  const { columns } = useColumns<RowData>();
  const { filters } = useFilters<{}, RowData>();

  //#region Search & Filter
  const { searchQuery } = useSearchQuery();
  const searchableColumns = useMemo(() => columns.filter(({ searchable }) => searchable), [columns]);
  const matchesSearchQuery = useCallback(
    (row: Row<RowData>) => !searchQuery || searchableColumns.some((column) => column.searchFn(searchQuery, row)),
    [searchQuery, searchableColumns]
  );
  const mustFilters = useMemo(() => filters.filter(({ chainAs }) => chainAs === 'MUST'), [filters]);
  const shouldFilters = useMemo(() => filters.filter(({ chainAs }) => chainAs === 'SHOULD'), [filters]);
  const matchesFilters = useCallback(
    (row: Row<RowData>) =>
      mustFilters.length === 0 ||
      mustFilters.every(({ operator }) => operator(row)) ||
      shouldFilters.some(({ operator }) => operator(row)),
    [mustFilters, shouldFilters]
  );
  //#endregion Search & Filter

  //#region Sort
  const sortedColumns = useMemo(() => columns.filter(({ sortingDirection }) => defined(sortingDirection)), [columns]);
  const comparingRowData = useCallback(
    (a: Row<RowData>, b: Row<RowData>) => {
      let resultInBetween = 0;
      for (const column of sortedColumns) {
        resultInBetween = column.sortFn(a, b, column.sortingDirection);
        if (resultInBetween !== 0) {
          // No need to check further!
          return resultInBetween;
        }
      }
      return resultInBetween;
    },
    [sortedColumns]
  );
  //#endregion Sort

  const rows = useMemo(
    () => extendedRows.filter(matchesSearchQuery).filter(matchesFilters).sort(comparingRowData),
    [comparingRowData, extendedRows, matchesFilters, matchesSearchQuery]
  );

  return useMemo(() => <RowsContext.Provider value={{ rows }}>{children}</RowsContext.Provider>, [children, rows]);
}
