import { Context, useContext, useMemo } from 'react';
import { UseFilters } from '../types';
import { FilterContext, FilterContextProps } from '../internal/filter-context';

export function useFilters<
  CustomFilter extends Record<string, any> = {},
  RowData extends Record<string, any> = {}
>(): UseFilters<CustomFilter, RowData> {
  const { filters, addFilter, updateFilter, removeFilter, isFiltersUpdatePending } = useContext<
    FilterContextProps<CustomFilter, RowData>
  >(FilterContext as unknown as Context<FilterContextProps<CustomFilter, RowData>>);

  return useMemo<UseFilters<CustomFilter, RowData>>(
    () => ({ filters, addFilter, updateFilter, removeFilter, isFiltersUpdatePending }),
    [addFilter, filters, isFiltersUpdatePending, removeFilter, updateFilter]
  );
}
