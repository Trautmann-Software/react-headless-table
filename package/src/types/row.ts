export type Row<RowData extends Record<string, any> = {}> = {
  id: string;
  data: RowData;
};

export type UseRows<RowData extends Record<string, any> = {}> = {
  allRows: Array<Row<RowData>>;
  filteredRows: Array<Row<RowData>>;
  sortedRows: Array<Row<RowData>>;
};
