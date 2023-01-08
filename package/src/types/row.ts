export type Row<RowData extends Record<string, any> = {}> = {
  /**
   * A unique ID of a row.
   */
  id: string;
  /**
   * Passed data for the row.
   */
  data: RowData;
};

export type UseRows<RowData extends Record<string, any> = {}> = {
  /**
   * All rows that match to the current search query and filters ordered by current sorting state.
   */
  rows: Array<Row<RowData>>;
};
