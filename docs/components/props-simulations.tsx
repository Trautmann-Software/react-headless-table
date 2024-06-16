import { ReactHeadlessTableProps, UseSearchQuery } from '@trautmann/react-headless-table';
import { Fragment } from 'react';

export function ReactHeadlessTable<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  CustomOptions extends Record<string, any> = {},
  CustomFilter extends Record<string, any> = {},
>(props: ReactHeadlessTableProps<RowData, CustomColumn, CustomOptions, CustomFilter>) {
  console.log(props);
  return <Fragment />;
}

export function UseSearchQueryProps(props: UseSearchQuery) {
  console.log(props);
  return <Fragment />;
}
