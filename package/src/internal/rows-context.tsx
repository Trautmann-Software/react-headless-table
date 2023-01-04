import { createContext, PropsWithChildren, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Row } from '../types';
import { v4 as uuid } from 'uuid';

export type RowsContextProps<RowData extends Record<string, any> = {}> = {
  rows: Array<Row<RowData>>;
};

export const RowsContext = createContext<RowsContextProps>({
  rows: [],
});

type Props<RowData extends Record<string, any> = {}> = PropsWithChildren<{
  rows: Array<RowData>;
}>;

export function RowsContextProvider<RowData extends Record<string, any> = {}>(props: Props<RowData>) {
  const { children, rows: passedRows } = props;
  const [rows, setRows] = useState<Array<Row<RowData>>>([]);

  const deferredRows = useDeferredValue(passedRows);
  const extendedRows = useMemo<Array<Row<RowData>>>(
    () =>
      deferredRows.map((rowData) => ({
        id: uuid(),
        data: rowData,
      })),
    [deferredRows]
  );

  useEffect(() => setRows(extendedRows), [extendedRows]);

  return useMemo(() => <RowsContext.Provider value={{ rows }}>{children}</RowsContext.Provider>, [children, rows]);
}
