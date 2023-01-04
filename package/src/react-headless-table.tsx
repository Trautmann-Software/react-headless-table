import { PropsWithChildren, useMemo } from 'react';
import { SearchContextProvider } from './internal/search-context';
import { Column, Options } from './types';
import { ColumnContextProvider } from './internal/column-context';
import { RowsContextProvider } from './internal/rows-context';
import { OptionsContextProvider } from './internal/options-context';

/**
 * @template RowData is the generic row type.
 * @template CustomColumn is the additional type definitions of the column.
 * @template CustomOptions is the additional fields/attributes to be added into the options type definition.
 */
export type ReactHeadlessTableProps<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  CustomOptions extends Record<string, any> = {}
> = PropsWithChildren<{
  options?: Options<CustomOptions, CustomColumn, RowData>;
  columns: Array<Column<RowData, CustomColumn>>;
  searchQuery?: string;
  rows: Array<RowData>;
}>;

/**
 * @template RowData is the generic row type.
 * @template CustomColumn is the additional type definitions of the column.
 * @template CustomOptions is the additional fields/attributes to be added into the options type definition.
 */
export function ReactHeadlessTable<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  CustomOptions extends Record<string, any> = {}
>(props: ReactHeadlessTableProps<RowData, CustomColumn, CustomOptions>) {
  const { children, options, columns, searchQuery, rows } = props;

  return useMemo(
    () => (
      <OptionsContextProvider options={options}>
        <ColumnContextProvider columns={columns}>
          <SearchContextProvider searchQuery={searchQuery}>
            <RowsContextProvider rows={rows}>{children}</RowsContextProvider>
          </SearchContextProvider>
        </ColumnContextProvider>
      </OptionsContextProvider>
    ),
    [children, columns, options, rows, searchQuery]
  );
}
