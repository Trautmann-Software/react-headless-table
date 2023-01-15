import { PropsWithChildren } from 'react';
import { Options } from './options';
import { Column } from './column';
import { Filter } from './filter';

/**
 * @template RowData is the generic row type.
 * @template CustomColumn is the additional type definitions of the column.
 * @template CustomOptions is the additional fields/attributes to be added into the options type definition.
 * @template CustomFilter is the additional type definitions for the filter.
 */
export type ReactHeadlessTableProps<
  RowData extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  CustomOptions extends Record<string, any> = {},
  CustomFilter extends Record<string, any> = {}
> = PropsWithChildren<{
  /**
   * Extendable options.
   */
  options?: Options<CustomOptions, CustomColumn, RowData>;
  /**
   * Extendable column entries.
   */
  columns: Array<Column<RowData, CustomColumn>>;
  /**
   * Initial search query.
   * @default undefined
   */
  searchQuery?: string;
  /**
   * Row entries.
   */
  rows: Array<RowData>;
  /**
   * Initial filters to apply.
   */
  filters?: Array<Filter<CustomFilter, RowData>>;
}>;
