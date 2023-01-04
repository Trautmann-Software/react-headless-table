import { Context, useCallback, useContext, useMemo } from 'react';
import { Row, UseRows } from '../types';
import { RowsContext, RowsContextProps } from '../internal/rows-context';
import { useSearchQuery } from './use-search-query';

export function useRows<RowData extends Record<string, any> = {}>(): UseRows<RowData> {
  const { rows: allRows } = useContext<RowsContextProps<RowData>>(
    RowsContext as unknown as Context<RowsContextProps<RowData>>
  );

  //#region Search & Filter
  const { searchQuery } = useSearchQuery();
  const matchesSearchQuery = useCallback((row: Row<RowData>) => !searchQuery || row.id, [searchQuery]);
  const filteredRows = useMemo(() => allRows.filter(matchesSearchQuery), [allRows, matchesSearchQuery]);
  //#endregion Search & Filter

  //#region Sort
  const comparingRowData = useCallback((a: Row<RowData>, b: Row<RowData>) => 0, []);
  const sortedRows = useMemo(() => [...filteredRows].sort(comparingRowData), [filteredRows, comparingRowData]);
  //#endregion Sort

  return useMemo<UseRows<RowData>>(() => ({ allRows, filteredRows, sortedRows }), [allRows, filteredRows, sortedRows]);
}
