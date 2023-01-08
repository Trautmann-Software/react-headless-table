import { Context, useContext, useMemo } from 'react';
import { UseColumns } from '../types';
import { ColumnContext, ColumnContextProps } from '../internal/column-context';

export function useColumns<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {}
>(): UseColumns<RowData, CustomColumn> {
  const {
    columns,
    hideColumn,
    showColumn,
    toggleColumnVisibility,
    isColumnVisibilityChangePending,
    swapColumnOrder,
    isSwapColumnOrderPending,
  } = useContext<ColumnContextProps<RowData, CustomColumn>>(
    ColumnContext as unknown as Context<ColumnContextProps<RowData, CustomColumn>>
  );

  return useMemo<UseColumns<RowData, CustomColumn>>(
    () => ({
      columns,
      hideColumn,
      showColumn,
      toggleColumnVisibility,
      isColumnVisibilityChangePending,
      swapColumnOrder,
      isSwapColumnOrderPending,
    }),
    [
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
