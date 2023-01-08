import { Row } from './row';
import { BooleanFormatOptions } from './options';

export type SortingDirection = 'asc' | 'desc' | undefined;

/**
 * An extendable column.
 * Column can be extended with additional fields if necessary.
 * @template RowData is the generic row type.
 * @template CustomColumn is the additional type definitions for the column.
 */
export type Column<RowData extends Record<string, any> = {}, CustomColumn extends Record<string, any> = {}> = {
  [Key in keyof CustomColumn]: Key extends undefined ? never : CustomColumn[Key];
} & (
  | {
      type: 'string';
      /**
       * Can be used to define complex way of access to the cell value from row data. Works well together with default
       * sorting, filtering, export, without needing to override them to access value from deep child objects.
       * Overrides data access via 'field'-attribute.
       * This way is far more efficient than dot-notation!!!
       */
      value?: (row: Row<RowData>) => string | undefined;
    }
  | {
      type: 'multi-string';
      value?: (row: Row<RowData>) => Array<string> | undefined;
    }
  | {
      type: 'boolean';
      value?: (row: Row<RowData>) => boolean | undefined;
      /**
       * Format options for 'boolean' type values.
       * Search and sort algorithms use these translations.
       * @default retrieved from options.
       */
      formatOptions?: BooleanFormatOptions;
    }
  | {
      type: 'number';
      value?: (row: Row<RowData>) => number | undefined;
      /**
       * Locale that overrides global/browser locale (navigator.language) for this column.
       * Used for compare functions on searching, filtering and sorting.
       */
      locale?: string;
      /**
       * Format options for 'number' type values.
       * @default {}
       */
      formatOptions?: Intl.NumberFormatOptions;
    }
  | {
      type: 'bigint';
      value?: (row: Row<RowData>) => bigint | undefined;
      locale?: string;
      /**
       * Format options for 'bigint' type values.
       * @default {}
       */
      formatOptions?: BigIntToLocaleStringOptions;
    }
  | {
      type: 'date';
      value?: (row: Row<RowData>) => Date | undefined;
      locale?: string;
      /**
       * Format options for 'date' type values.
       * @default { style: 'currency' }
       */
      formatOptions?: Intl.DateTimeFormatOptions;
    }
  | {
      type: 'time';
      value?: (row: Row<RowData>) => Date | undefined;
      locale?: string;
      /**
       * Format options for 'time' type values.
       * @default {}
       */
      formatOptions?: Intl.DateTimeFormatOptions;
    }
  | {
      type: 'date-time';
      value?: (row: Row<RowData>) => Date | undefined;
      locale?: string;
      /**
       * Format options for 'date-time' type values.
       * @default {}
       */
      formatOptions?: Intl.DateTimeFormatOptions;
    }
  | {
      type: 'relative-time';
      value?: (row: Row<RowData>) => number | undefined;
      locale?: string;
      /**
       * Relative time format unit to use on rendering the value.
       */
      relativeTimeFormatUnit: Intl.RelativeTimeFormatUnit;
      /**
       * Format options for 'relative-time' type values.
       * @default {}
       */
      formatOptions?: Intl.RelativeTimeFormatOptions;
    }
) & {
    /**
     * Used as a key to reference the column itself.
     * If not provided, then value of the `field`-attribute is used instead.
     * Value of the id must be unique for each column!!!
     */
    id?: string;
    /**
     * Used as a key to reference value in row data.
     * The field also serves as a column ID to reference the column itself.
     * Value of the field must be unique for each column!!!
     * For a complex way of access to the cell value from row data see 'value'-attribute.
     */
    field: keyof RowData | string;
    /**
     * Flag to initially hide the column.
     * @default false
     */
    hidden?: boolean;
    /**
     * If true, includes the column on performing a search
     * @default true
     */
    searchable?: boolean;
    /**
     * Overrides the search algorithm for this column.
     * @param term is the current search query.
     * @param row
     */
    searchFn?: (term: string, row: Row<RowData>) => boolean;
    /**
     * Initial sorting direction for the column.
     * @default undefined
     */
    sortingDirection?: SortingDirection;
    /**
     * Overrides the sort algorithm for this column.
     */
    sortFn?: (a: Row<RowData>, b: Row<RowData>) => number;
    /**
     * Initial order index of this column.
     * If not provided, array index is used!!!
     */
    order?: number;
  };

/**
 * Extended column.
 * Column were extended with additional fields.
 * @template RowData is the generic row type.
 * @template CustomColumn is the additional type definitions for the column.
 */
export type ExtendedColumn<RowData extends Record<string, any> = {}, CustomColumn extends Record<string, any> = {}> = {
  [Key in keyof CustomColumn]: Key extends undefined ? never : CustomColumn[Key];
} & Required<Omit<Column<RowData>, 'sortingDirection'>> &
  Pick<Column<RowData>, 'sortingDirection'>;

/**
 * Delivers Extended column information and functionality to work with column entries.
 * @template RowData is the generic row type.
 * @template CustomColumn is the additional type definitions for the column.
 */
export type UseColumns<RowData extends Record<string, any> = {}, CustomColumn extends Record<string, any> = {}> = {
  /**
   * Extended stateful columns.
   */
  columns: Array<ExtendedColumn<RowData, CustomColumn>>;
  /**
   * Sets `hidden` attribute to `true` for the given column ID.
   */
  hideColumn: (columnId: string) => void;
  /**
   * Sets `hidden` attribute to `false` for the given column ID.
   */
  showColumn: (columnId: string) => void;
  /**
   * Reverts `hidden` attribute for the given column ID.
   */
  toggleColumnVisibility: (columnId: string) => void;
  /**
   * Swaps `order` attributes for the given column IDs.
   */
  swapColumnOrder: (columnId1: string, columnId2: string) => void;
  /**
   * Sets `sortingDirection` attribute to the give one for the given column ID, and resets to undefined for all other columns.
   */
  sort: (columnId: string, sortingDirection: SortingDirection) => void;
  /**
   * Sets `sortingDirection` attribute to the next one for the given column ID, and resets to undefined for all other columns.
   * Sequence: 'asc' => 'desc' => undefined => 'asc'
   */
  toggleSort: (columnId: string) => void;
};
