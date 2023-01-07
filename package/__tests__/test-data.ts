import { Column, Row } from '../src';

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

export type CustomFilter = {
  customFilterField: string;
  customOptionalFilterField?: string;
}
