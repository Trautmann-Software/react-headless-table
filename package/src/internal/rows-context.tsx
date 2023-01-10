import { Context, createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react';
import { Row, UseRows } from '../types';
import { useColumns, useFilters, useRowSelection, useSearchQuery } from '../hooks';
import { defined } from '../utils';
import { RowsWithIdsContext, RowsWithIdsContextProps } from './rows-with-ids-context';

export type RowsContextProps<RowData extends Record<string, any> = {}> = UseRows<RowData>;

export const RowsContext = createContext<RowsContextProps>({
  rows: [],
});

export function RowsContextProvider<RowData extends Record<string, any> = {}>({ children }: PropsWithChildren) {
  const { rowsWithIds } = useContext<RowsWithIdsContextProps<RowData>>(
    RowsWithIdsContext as unknown as Context<RowsWithIdsContextProps<RowData>>
  );
  const { selectedRowIds } = useRowSelection();

  const extendRow = useCallback<(row: Pick<Row<RowData>, 'id' | 'data'>) => Row<RowData>>(
    (row) => ({
      ...row,
      selected: selectedRowIds.has(row.id),
    }),
    [selectedRowIds]
  );
  const extendedRows = useMemo(() => rowsWithIds.map(extendRow), [extendRow, rowsWithIds]);

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
