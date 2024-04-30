import {
  createContext,
  PropsWithChildren,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { Filter, UseFilters } from '../types';
import { v4 as uuid } from 'uuid';
import { noop } from '../utils';

/**
 * @template CustomFilter is the additional type definitions for the filter.
 * @template RowData is the generic row type.
 */
export type FilterContextProps<
  CustomFilter extends Record<string, any> = {},
  RowData extends Record<string, any> = {},
> = UseFilters<CustomFilter, RowData>;

export const FilterContext = createContext<FilterContextProps>({
  filters: [],
  addFilter: noop,
  updateFilter: noop,
  removeFilter: noop,
  isFiltersUpdatePending: false,
});

type Props<
  CustomFilter extends Record<string, any> = {},
  RowData extends Record<string, any> = {},
> = PropsWithChildren<{
  filters?: Array<Filter<CustomFilter, RowData>>;
}>;

/**
 * @template CustomFilter is the additional type definitions for the filter.
 * @template RowData is the generic row type.
 */
export function FilterContextProvider<
  CustomFilter extends Record<string, any> = {},
  RowData extends Record<string, any> = {},
>(props: Props<CustomFilter, RowData>) {
  const { children, filters: passedFilters } = props;
  const deferredPassedFilters = useDeferredValue(passedFilters);

  const [filters, setFilters] = useState<Array<Filter<CustomFilter, RowData>>>([]);

  const extendFilter = useCallback<(filter: Filter<CustomFilter, RowData>) => Filter<CustomFilter, RowData>>(
    (filter) => ({ ...filter, id: filter.id ?? uuid(), chainAs: filter.chainAs ?? 'MUST' }),
    []
  );
  useEffect(() => setFilters((deferredPassedFilters ?? []).map(extendFilter)), [deferredPassedFilters, extendFilter]);

  const [isFiltersUpdatePending, startFiltersUpdateTransition] = useTransition();
  const addFilter = useCallback<UseFilters<CustomFilter, RowData>['addFilter']>(
    (filter) => {
      startFiltersUpdateTransition(() => {
        setFilters((currentFilters) => [
          ...currentFilters,
          {
            ...filter,
            id: filter.id ?? uuid(),
            chainAs: filter.chainAs ?? 'MUST',
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
                  chainAs: filter.chainAs ?? 'MUST',
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

  return useMemo(
    () => (
      // eslint-disable-next-line
      // @ts-ignore
      <FilterContext.Provider value={{ filters, addFilter, updateFilter, removeFilter, isFiltersUpdatePending }}>
        {children}
      </FilterContext.Provider>
    ),
    [addFilter, children, filters, isFiltersUpdatePending, removeFilter, updateFilter]
  );
}
