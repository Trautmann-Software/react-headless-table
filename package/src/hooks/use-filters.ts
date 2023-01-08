import { Context, useCallback, useContext, useMemo, useTransition } from 'react';
import { UseFilters } from '../types/filter';
import { FilterContext, FilterContextProps } from '../internal/filter-context';
import { v4 as uuid } from 'uuid';

export function useFilters<
  CustomFilter extends Record<string, any> = {},
  RowData extends Record<string, any> = {}
>(): UseFilters<CustomFilter, RowData> {
  const { filters, setFilters } = useContext<FilterContextProps<CustomFilter, RowData>>(
    FilterContext as unknown as Context<FilterContextProps<CustomFilter, RowData>>
  );

  const [isFiltersUpdatePending, startFiltersUpdateTransition] = useTransition();
  const addFilter = useCallback<UseFilters<CustomFilter, RowData>['addFilter']>(
    (filter) => {
      startFiltersUpdateTransition(() => {
        setFilters((currentFilters) => [
          ...currentFilters,
          {
            ...filter,
            id: filter.id ?? uuid(),
            chainAs: filter.chainAs ?? 'AND',
          },
        ]);
      });
    },
    [setFilters]
  );
  const updateFilter = useCallback<UseFilters<CustomFilter, RowData>['updateFilter']>(
    (filter) => {
      startFiltersUpdateTransition(() => {
        setFilters((currentFilters) =>
          currentFilters.map((existingFilter) =>
            existingFilter.id === filter.id
              ? {
                  ...filter,
                  id: filter.id ?? uuid(),
                  chainAs: filter.chainAs ?? 'AND',
                }
              : existingFilter
          )
        );
      });
    },
    [setFilters]
  );
  const removeFilter = useCallback<UseFilters<CustomFilter, RowData>['removeFilter']>(
    (filterId) => {
      startFiltersUpdateTransition(() => {
        setFilters((currentFilters) => currentFilters.filter(({ id }) => id !== filterId));
      });
    },
    [setFilters]
  );

  return useMemo<UseFilters<CustomFilter, RowData>>(
    () => ({ filters, addFilter, updateFilter, removeFilter, inProgress: isFiltersUpdatePending }),
    [addFilter, filters, isFiltersUpdatePending, removeFilter, updateFilter]
  );
}
