import { Context, useContext, useMemo } from 'react';
import { UseColumns } from '../types';
import { ColumnContext, ColumnContextProps } from '../internal/column-context';

export function useColumns<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {}
>(): UseColumns<RowData, CustomColumn> {
  const { columns, hideColumn, showColumn, toggleColumnVisibility, swapColumnOrder, sort, toggleSort } = useContext<
    ColumnContextProps<RowData, CustomColumn>
  >(ColumnContext as unknown as Context<ColumnContextProps<RowData, CustomColumn>>);

  return useMemo<UseColumns<RowData, CustomColumn>>(
    () => ({
      columns,
      hideColumn,
      showColumn,
      toggleColumnVisibility,
      swapColumnOrder,
      sort,
      toggleSort,
    }),
    [columns, hideColumn, showColumn, sort, swapColumnOrder, toggleColumnVisibility, toggleSort]
  );
}
