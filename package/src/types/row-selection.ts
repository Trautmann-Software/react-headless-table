export type UseRowSelection = {
  /**
   * Set of row IDs that are currently selected.
   */
  selectedRowIds: Set<string>;
  /**
   * Adds given row ID into the set of selected row IDs.
   */
  select: (rowId: string) => void;
  /**
   * Removes given row ID from the set of selected row IDs.
   */
  deselect: (rowId: string) => void;
  /**
   * Adds given row IDs into the set of selected row IDs.
   */
  selectMultiple: (rowIds: Array<string>) => void;
  /**
   * Removes given row IDs into the set of selected row IDs.
   */
  deselectMultiple: (rowIds: Array<string>) => void;
  /**
   * Adds all row IDs into the set of selected row IDs.
   */
  selectAll: () => void;
  /**
   * Clears the set of selected row IDs.
   */
  deselectAll: () => void;
  /**
   * true, only if there is at least one selected row.
   */
  hasSelectedRows: boolean;
  /**
   * true, only if all rows are selected.
   */
  allSelected: boolean;
};
