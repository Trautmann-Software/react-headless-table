import { Row } from './row';

/**
 * An extendable Filter.
 * Filter can be extended with additional fields if necessary.
 * @template CustomFilter is the additional type definitions for the filter.
 * @template RowData is the generic row type.
 */
export type Filter<CustomFilter extends Record<string, any> = {}, RowData extends Record<string, any> = {}> = {
  [Key in keyof CustomFilter]: Key extends undefined ? never : CustomFilter[Key];
} & {
  /**
   * ID of the filter. If not provided, a UUID will be generated.
   */
  id?: string;
  /**
   * ID of the column that filter represents.
   */
  columnId?: string;
  /**
   * Operator to apply.
   */
  operator: (row: Row<RowData>) => boolean;
  /**
   * Defines how this filter should be chained with other filters.
   * @default 'AND'
   */
  chainAs?: 'AND' | 'OR';
};

/**
 * Delivers filter information and functionality to work with filter entries.
 * @template CustomFilter is the additional type definitions for the filter.
 * @template RowData is the generic row type.
 */
export type UseFilters<CustomFilter extends Record<string, any> = {}, RowData extends Record<string, any> = {}> = {
  filters: Array<Filter<CustomFilter, RowData>>;
  addFilter: (filter: Filter<CustomFilter, RowData>) => void;
  updateFilter: (filter: Filter<CustomFilter, RowData>) => void;
  removeFilter: (filterId: string) => void;
  isFiltersUpdatePending: boolean;
};
