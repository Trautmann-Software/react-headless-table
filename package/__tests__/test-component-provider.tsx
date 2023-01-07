import { ReactHeadlessTable, ReactHeadlessTableProps } from '../src';

export function TestComponentProvider<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  CustomOptions extends Record<string, any> = {},
  CustomFilter extends Record<string, any> = {}
>(props: Partial<ReactHeadlessTableProps<RowData, CustomColumn, CustomOptions, CustomFilter>>) {
  const { children, columns, rows, ...otherProps } = props;
  return (
    <ReactHeadlessTable {...otherProps} columns={columns ?? []} rows={rows ?? []}>
      {children}
    </ReactHeadlessTable>
  );
}
