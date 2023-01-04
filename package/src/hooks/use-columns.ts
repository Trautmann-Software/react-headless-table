import { Context, useCallback, useContext, useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react';
import { UseColumns } from '../types';
import { ColumnContext, ColumnContextProps } from '../internal/column-context';
import { defined } from '../utils';

export function useColumns<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {}
>(): UseColumns<RowData, CustomColumn> {
  const { columns } = useContext<ColumnContextProps<RowData, CustomColumn>>(
    ColumnContext as unknown as Context<ColumnContextProps<RowData, CustomColumn>>
  );

  //#region Column re-ordering
  const [isSwapColumnOrderPending, startSwapColumnOrderTransition] = useTransition();
  const [columnOrders, setColumnOrders] = useState(new Map<string, number>());
  const deferredColumnOrders = useDeferredValue(columnOrders);
  useEffect(() => {
    startSwapColumnOrderTransition(() => {
      setColumnOrders(new Map<string, number>(columns.map(({ field, order }) => [String(field), order])));
    });
  }, [columns]);
  const swapColumnOrder = useCallback<UseColumns<RowData, CustomColumn>['swapColumnOrder']>(
    (fieldA, fieldB) => {
      startSwapColumnOrderTransition(() => {
        const orderA = columnOrders.get(fieldA);
        const orderB = columnOrders.get(fieldB);
        if (defined(orderA) && defined(orderB)) {
          columnOrders.set(fieldA, orderB);
          columnOrders.set(fieldB, orderA);
          setColumnOrders(new Map(columnOrders));
        }
      });
    },
    [columnOrders]
  );
  const orderedColumns = useMemo(
    () =>
      [...columns].sort(
        (a, b) => (deferredColumnOrders.get(String(a.field)) ?? 0) - (deferredColumnOrders.get(String(b.field)) ?? 0)
      ),
    [columns, deferredColumnOrders]
  );
  //#endregion Column re-ordering

  //#region Column visibility
  const [isColumnVisibilityChangePending, startColumnVisibilityChangeTransition] = useTransition();
  const [visibleColumnIds, setVisibleColumnIds] = useState(new Set<string>());
  const deferredVisibleColumnIds = useDeferredValue(visibleColumnIds);
  useEffect(() => {
    startColumnVisibilityChangeTransition(() => {
      setVisibleColumnIds(new Set(columns.filter((column) => !column.hidden).map((column) => String(column.field))));
    });
  }, [columns]);
  const visibleColumns = useMemo(
    () => columns.filter((column) => deferredVisibleColumnIds.has(String(column.field))),
    [columns, deferredVisibleColumnIds]
  );
  const orderedVisibleColumns = useMemo(
    () => orderedColumns.filter((column) => deferredVisibleColumnIds.has(String(column.field))),
    [orderedColumns, deferredVisibleColumnIds]
  );
  const hideColumn = useCallback<UseColumns<RowData, CustomColumn>['hideColumn']>(
    (field) => {
      startColumnVisibilityChangeTransition(() => {
        if (visibleColumnIds.has(field)) {
          visibleColumnIds.delete(field);
          setVisibleColumnIds(new Set(visibleColumnIds));
        }
      });
    },
    [visibleColumnIds]
  );
  const showColumn = useCallback<UseColumns<RowData, CustomColumn>['showColumn']>(
    (field) => {
      startColumnVisibilityChangeTransition(() => {
        if (!visibleColumnIds.has(field)) {
          visibleColumnIds.add(field);
          setVisibleColumnIds(new Set(visibleColumnIds));
        }
      });
    },
    [visibleColumnIds]
  );
  const toggleColumnVisibility = useCallback<UseColumns<RowData, CustomColumn>['toggleColumnVisibility']>(
    (field) => {
      startColumnVisibilityChangeTransition(() => {
        if (visibleColumnIds.has(field)) {
          hideColumn(field);
        } else {
          showColumn(field);
        }
      });
    },
    [hideColumn, showColumn, visibleColumnIds]
  );
  //#endregion Column visibility

  return useMemo<UseColumns<RowData, CustomColumn>>(
    () => ({
      allColumns: columns,
      visibleColumns,
      orderedVisibleColumns,
      hideColumn,
      showColumn,
      toggleColumnVisibility,
      isColumnVisibilityChangePending,
      swapColumnOrder,
      isSwapColumnOrderPending,
    }),
    [
      columns,
      orderedVisibleColumns,
      hideColumn,
      isColumnVisibilityChangePending,
      isSwapColumnOrderPending,
      showColumn,
      swapColumnOrder,
      toggleColumnVisibility,
      visibleColumns,
    ]
  );
}
