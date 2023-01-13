export type BooleanFormatOptions = {
  true: string;
  false: string;
  empty: string;
};

export type InternationalizationOptions = {
  /**
   * Locale that can be used to set globally.
   * Can be overridden for columns individually in column definitions.
   * Used for compare functions on searching, filtering and sorting.
   * @default undefined
   */
  locale?: string;
  /**
   * Collator options for 'string' and 'multi-string' type values.
   * If provided, then will be considered in sorting algorithm.
   * @default {}
   */
  collatorOptions?: Intl.CollatorOptions;
  /**
   * Format options for 'number' type values.
   * @default {}
   */
  numberFormatOptions?: Intl.NumberFormatOptions;
  /**
   * Format options for 'bigint' type values.
   * @default {}
   */
  bigintFormatOptions?: BigIntToLocaleStringOptions;
  /**
   * Format options for 'date' type values.
   * @default { style: 'currency' }
   */
  dateFormatOptions?: Intl.DateTimeFormatOptions;
  /**
   * Format options for 'time' type values.
   * @default {}
   */
  timeFormatOptions?: Intl.DateTimeFormatOptions;
  /**
   * Format options for 'date-time' type values.
   * @default {}
   */
  dateTimeFormatOptions?: Intl.DateTimeFormatOptions;
  /**
   * Format options for 'relative-time' type values.
   * @default {}
   */
  relativeTimeFormatOptions?: Intl.RelativeTimeFormatOptions;
  /**
   * Format options for 'boolean' type values.
   * Search and sort algorithms use these translations.
   * @default {'true': 'true', 'false': 'false', 'empty': ''}
   */
  booleanFormatOptions?: BooleanFormatOptions;
};

export type RowOptions<RowData extends Record<string, any> = {}> = {
  /**
   * ID generation strategy for rows.
   * @param rowData is the representation of a row data.
   * @default `uuid.v4()` from `uuid` package.
   */
  idFn?: (rowData: RowData) => string;
  /**
   * Detail panel visibility type.
   * Defines whether a single panel at the same time can be showed or multiple panels from different rows.
   * @default 'single'
   */
  detailsPanelType?: 'single' | 'multiple';
};

export type PaginationOptions = {
  /**
   * Current page number.
   * @default 1
   */
  currentPage?: number;
  /**
   * Number of rows per page.
   * @default 5
   */
  pageSize?: number;
};

/**
 * An extendable options.
 * Options can be extended with additional fields if necessary.
 * @template CustomOptions is the additional fields/attributes to be added into the options type definition.
 * @template CustomColumn is the additional type definitions of the column.
 * @template RowData is the generic row type.
 */
export type Options<
  CustomOptions extends Record<string, any> = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CustomColumn extends Record<string, any> = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  RowData extends Record<string, any> = {}
> = { [Key in keyof CustomOptions]: Key extends undefined ? never : CustomOptions[Key] } & {
  /**
   * Internationalization options for supported value types.
   */
  internationalizationOptions?: InternationalizationOptions;
  /**
   * Row related options.
   */
  rowOptions?: RowOptions;
  /**
   * Pagination related options.
   */
  paginationOptions?: PaginationOptions;
};

/**
 * Extended options.
 * Options including CustomOptions can be referenced typesafe.
 * @template CustomOptions is the additional fields/attributes that were added into the options type definition.
 * @template CustomColumn is the additional type definitions of the column.
 * @template RowData is the generic row type.
 */
export type UseOptions<
  CustomOptions extends Record<string, any> = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CustomColumn extends Record<string, any> = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  RowData extends Record<string, any> = {}
> = { [Key in keyof CustomOptions]: Key extends undefined ? never : CustomOptions[Key] } & {
  /**
   * Internationalization options for supported value types.
   */
  internationalizationOptions: InternationalizationOptions;
  /**
   * Row related options.
   */
  rowOptions: Required<RowOptions>;
  /**
   * Pagination related options.
   */
  paginationOptions: Required<PaginationOptions>;
};
