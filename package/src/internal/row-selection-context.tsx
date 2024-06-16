import { Context, createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { defined, noop } from '../utils';
import { RowsWithIdsContext, RowsWithIdsContextProps } from './rows-with-ids-context';
import { UseRowSelection } from '../types';

type SelectionContextProps = UseRowSelection;

export const RowSelectionContext = createContext<SelectionContextProps>({
  selectedRowIds: new Set<string>(),
  select: noop,
  deselect: noop,
  selectMultiple: noop,
  deselectMultiple: noop,
  selectAll: noop,
  deselectAll: noop,
  hasSelectedRows: false,
  allSelected: false,
});

export function RowSelectionContextProvider({ children }: PropsWithChildren) {
  const [selectedRowIds, setSelectedRowIds] = useState<SelectionContextProps['selectedRowIds']>(new Set<string>());

  const selectMultiple = useCallback<SelectionContextProps['selectMultiple']>(
    (rowIds) => setSelectedRowIds((previousRowIds) => new Set([...previousRowIds, ...rowIds.filter(defined)])),
    []
  );
  const deselectMultiple = useCallback<SelectionContextProps['deselectMultiple']>(
    (rowIds) =>
      setSelectedRowIds((previousRowIds) => {
        const newRowIds = new Set(previousRowIds);
        rowIds.filter(defined).forEach((rowId) => newRowIds.delete(rowId));
        return newRowIds;
      }),
    []
  );
  const select = useCallback<SelectionContextProps['select']>((rowId) => selectMultiple([rowId]), [selectMultiple]);
  const deselect = useCallback<SelectionContextProps['deselect']>(
    (rowId) => deselectMultiple([rowId]),
    [deselectMultiple]
  );

  const { rowsWithIds } = useContext<RowsWithIdsContextProps>(
    RowsWithIdsContext as unknown as Context<RowsWithIdsContextProps>
  );
  const allRowIds = useMemo(() => new Set(rowsWithIds.map((row) => row.id)), [rowsWithIds]);
  const selectAll = useCallback<SelectionContextProps['selectAll']>(
    () => selectMultiple([...allRowIds]),
    [allRowIds, selectMultiple]
  );
  const deselectAll = useCallback<SelectionContextProps['deselectAll']>(() => setSelectedRowIds(new Set<string>()), []);

  return useMemo(
    () => (
      <RowSelectionContext.Provider
        value={{
          selectedRowIds,
          select,
          deselect,
          selectMultiple,
          deselectMultiple,
          selectAll,
          deselectAll,
          hasSelectedRows: selectedRowIds.size > 0,
          allSelected: selectedRowIds.size === allRowIds.size,
        }}
      >
        {children}
      </RowSelectionContext.Provider>
    ),
    [
      allRowIds.size,
      children,
      deselect,
      deselectAll,
      deselectMultiple,
      select,
      selectAll,
      selectMultiple,
      selectedRowIds,
    ]
  );
}
