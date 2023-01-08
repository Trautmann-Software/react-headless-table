import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Filter } from '../types/filter';
import { v4 as uuid } from 'uuid';
import { noop } from '../utils';

/**
 * @template CustomFilter is the additional type definitions for the filter.
 * @template RowData is the generic row type.
 */
export type FilterContextProps<
  CustomFilter extends Record<string, any> = {},
  RowData extends Record<string, any> = {}
> = {
  filters: Array<Filter<CustomFilter, RowData>>;
  setFilters: Dispatch<SetStateAction<Array<Filter<CustomFilter, RowData>>>>;
};

export const FilterContext = createContext<FilterContextProps>({
  filters: [],
  setFilters: noop,
});

type Props<
  CustomFilter extends Record<string, any> = {},
  RowData extends Record<string, any> = {}
> = PropsWithChildren<{
  filters?: Array<Filter<CustomFilter, RowData>>;
}>;

/**
 * @template CustomFilter is the additional type definitions for the filter.
 * @template RowData is the generic row type.
 */
export function FilterContextProvider<
  CustomFilter extends Record<string, any> = {},
  RowData extends Record<string, any> = {}
>(props: Props<CustomFilter, RowData>) {
  const { children, filters: passedFilters } = props;
  const [filters, setFilters] = useState<Array<Filter<CustomFilter, RowData>>>([]);

  const deferredFilters = useDeferredValue(passedFilters);
  const extendedFilters = useMemo<Array<Filter<CustomFilter, RowData>>>(
    () =>
      (deferredFilters ?? []).map((filter) => ({
        ...filter,
        id: filter.id ?? uuid(),
        chainAs: filter.chainAs ?? 'AND',
      })),
    [deferredFilters]
  );
  const deferredExtendedFilters = useDeferredValue(extendedFilters);
  useEffect(() => setFilters(deferredExtendedFilters), [deferredExtendedFilters]);

  return useMemo(
    () => (
      <FilterContext.Provider
        // eslint-disable-next-line
        // @ts-ignore
        value={{ filters, setFilters }}
      >
        {children}
      </FilterContext.Provider>
    ),
    [children, filters]
  );
}
