// eslint-disable-next-line
// @ts-ignore
import { Column, ReactHeadlessTable, ReactHeadlessTableProps, Row } from '@trautmann/react-headless-table';

export type Data = {
  name: string;
};

export type CustomColumn = {
  customColumnField: string;
  customOptionalColumnField?: string;
};

export type CustomOptions<GenericColumn extends Record<string, any> = {}, RowData extends Record<string, any> = {}> = {
  customOptionField: string;
  customOptionalOptionField?: string;

  customFn: (column: Column<GenericColumn>, row: Row<RowData>) => boolean;
};

export function Table<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  CustomOptions extends Record<string, any> = {}
>(props: Partial<ReactHeadlessTableProps<RowData, CustomColumn, CustomOptions>>) {
  const { children, ...otherProps } = props;
  return (
    <ReactHeadlessTable
      options={otherProps.options}
      columns={otherProps.columns ?? []}
      rows={otherProps.rows ?? []}
      searchQuery={otherProps.searchQuery ?? ''}
    >
      <div>
        {children}
      </div>
      <div>
        <table>
          <thead>
          <tr>
            <td>H1</td>
            <td>H2</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>H1 1</td>
            <td>H2 1</td>
          </tr>
          <tr>
            <td>H1 2</td>
            <td>H2 2</td>
          </tr>
          </tbody>
        </table>
      </div>
    </ReactHeadlessTable>
  );
}
