import { ReactHeadlessTable, ReactHeadlessTableProps } from '../src';

export function TestComponentProvider<
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
      {children}
    </ReactHeadlessTable>
  );
}
