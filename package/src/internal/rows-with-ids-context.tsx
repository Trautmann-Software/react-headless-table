import { createContext, PropsWithChildren, useCallback, useDeferredValue, useMemo } from 'react';
import { Row } from '../types';
import { useOptions } from '../hooks';

export type RowsWithIdsContextProps<RowData extends Record<string, any> = {}> = {
  rowsWithIds: Array<Pick<Row<RowData>, 'id' | 'data'>>;
};

export const RowsWithIdsContext = createContext<RowsWithIdsContextProps>({
  rowsWithIds: [],
});

type Props<RowData extends Record<string, any> = {}> = PropsWithChildren<{
  rows: Array<RowData>;
}>;

/**
 * This contains rows with ID and depends only on given rows and ID generator.
 * Provides rows with stable ID.
 */
export function RowsWithIdsContextProvider<RowData extends Record<string, any> = {}>(props: Props<RowData>) {
  const { children, rows: passedRows } = props;
  const deferredPassedRows = useDeferredValue(passedRows);
  const {
    rowOptions: { idFn: generateId },
  } = useOptions<{}, {}, RowData>();
  const extendRow = useCallback<(rowData: RowData) => Pick<Row<RowData>, 'id' | 'data'>>(
    (rowData) => ({
      id: generateId(rowData),
      data: rowData,
    }),
    [generateId]
  );
  const rowsWithIds = useMemo(() => deferredPassedRows.map(extendRow), [deferredPassedRows, extendRow]);

  return useMemo(
    () => <RowsWithIdsContext.Provider value={{ rowsWithIds }}>{children}</RowsWithIdsContext.Provider>,
    [children, rowsWithIds]
  );
}
