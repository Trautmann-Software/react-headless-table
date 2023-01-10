import { useContext, useMemo } from 'react';
import { UseRowSelection } from '../types';
import { RowSelectionContext } from '../internal/row-selection-context';

export function useRowSelection(): UseRowSelection {
  const selection = useContext(RowSelectionContext);
  return useMemo<UseRowSelection>(() => ({ ...selection }), [selection]);
}
