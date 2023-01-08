import { Column, Row } from '../src';

export type Data = {
  username: string;
  age: number;
  vip: boolean;
};

export const testRows: Array<Data> = [
  { username: 'username-1', age: 5, vip: false },
  { username: 'username-2', age: 15, vip: true },
  { username: 'username-3', age: 20, vip: false },
  { username: 'username-4', age: 40, vip: false },
  { username: 'username-5', age: 50, vip: false },
  { username: 'username-6', age: 30, vip: true },
];

export const testColumns: Array<Column<Data>> = [
  { field: 'username', type: 'string' },
  { field: 'age', type: 'number' },
  { field: 'vip', type: 'boolean' },
];

export type CustomColumn = {
  customColumnField: string;
  customOptionalColumnField?: string;
};

export type CustomOptions<GenericColumn extends Record<string, any> = {}, RowData extends Record<string, any> = {}> = {
  customOptionField: string;
  customOptionalOptionField?: string;

  customFn: (column: Column<GenericColumn>, row: Row<RowData>) => boolean;
};

export type CustomFilter = {
  customFilterField: string;
  customOptionalFilterField?: string;
};
