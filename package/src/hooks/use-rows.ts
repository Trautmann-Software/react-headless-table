import { Context, useContext, useMemo } from 'react';
import { UseRows } from '../types';
import { RowsContext, RowsContextProps } from '../internal/rows-context';

export function useRows<RowData extends Record<string, any> = {}>(): UseRows<RowData> {
  const { rows } = useContext<RowsContextProps<RowData>>(RowsContext as unknown as Context<RowsContextProps<RowData>>);

  return useMemo<UseRows<RowData>>(() => ({ rows }), [rows]);
}
