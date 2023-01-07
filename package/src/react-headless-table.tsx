import { PropsWithChildren, useMemo } from 'react';
import { SearchContextProvider } from './internal/search-context';
import { Column, Options } from './types';
import { ColumnContextProvider } from './internal/column-context';
import { RowsContextProvider } from './internal/rows-context';
import { OptionsContextProvider } from './internal/options-context';
import { Filter } from './types/filter';
import { FilterContextProvider } from './internal/filter-context';

/**
 * @template RowData is the generic row type.
 * @template CustomColumn is the additional type definitions of the column.
 * @template CustomOptions is the additional fields/attributes to be added into the options type definition.
 */
export type ReactHeadlessTableProps<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  CustomOptions extends Record<string, any> = {},
  CustomFilter extends Record<string, any> = {}
> = PropsWithChildren<{
  options?: Options<CustomOptions, CustomColumn, RowData>;
  columns: Array<Column<RowData, CustomColumn>>;
  searchQuery?: string;
  rows: Array<RowData>;
  filters?: Array<Filter<CustomFilter, RowData>>;
}>;

/**
 * @template RowData is the generic row type.
 * @template CustomColumn is the additional type definitions of the column.
 * @template CustomOptions is the additional fields/attributes to be added into the options type definition.
 * @template CustomFilter is the additional type definitions for the filter.
 */
export function ReactHeadlessTable<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  CustomOptions extends Record<string, any> = {},
  CustomFilter extends Record<string, any> = {}
>(props: ReactHeadlessTableProps<RowData, CustomColumn, CustomOptions, CustomFilter>) {
  const { children, options, columns, searchQuery, rows, filters } = props;

  return useMemo(
    () => (
      <OptionsContextProvider options={options}>
        <ColumnContextProvider columns={columns}>
          <SearchContextProvider searchQuery={searchQuery}>
            <FilterContextProvider filters={filters}>
              <RowsContextProvider rows={rows}>{children}</RowsContextProvider>
            </FilterContextProvider>
          </SearchContextProvider>
        </ColumnContextProvider>
      </OptionsContextProvider>
    ),
    [children, columns, filters, options, rows, searchQuery]
  );
}
