import { useMemo } from 'react';
import { SearchContextProvider } from './internal/search-context';
import { ReactHeadlessTableProps } from './types';
import { ColumnContextProvider } from './internal/column-context';
import { RowsContextProvider } from './internal/rows-context';
import { OptionsContextProvider } from './internal/options-context';
import { FilterContextProvider } from './internal/filter-context';
import { RowsWithIdsContextProvider } from './internal/rows-with-ids-context';
import { RowSelectionContextProvider } from './internal/row-selection-context';
import { PaginationContextProvider } from './internal/pagination-context';

export function ReactHeadlessTable<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  CustomOptions extends Record<string, any> = {},
  CustomFilter extends Record<string, any> = {},
>(props: ReactHeadlessTableProps<RowData, CustomColumn, CustomOptions, CustomFilter>) {
  const { children, options, columns, searchQuery, rows, filters } = props;

  return useMemo(
    () => (
      <OptionsContextProvider options={options}>
        <ColumnContextProvider columns={columns}>
          <SearchContextProvider searchQuery={searchQuery}>
            <FilterContextProvider filters={filters}>
              <RowsWithIdsContextProvider rows={rows}>
                <RowSelectionContextProvider>
                  <RowsContextProvider>
                    <PaginationContextProvider>{children}</PaginationContextProvider>
                  </RowsContextProvider>
                </RowSelectionContextProvider>
              </RowsWithIdsContextProvider>
            </FilterContextProvider>
          </SearchContextProvider>
        </ColumnContextProvider>
      </OptionsContextProvider>
    ),
    [children, columns, filters, options, rows, searchQuery]
  );
}
