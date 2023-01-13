import { Row } from './row';
import { Dispatch, SetStateAction } from 'react';

export type UsePagination<RowData extends Record<string, any> = {}> = {
  /**
   * Rows of the current page.
   */
  pageRows: Array<Row<RowData>>;
  /**
   * Current page number.
   */
  currentPage: number;
  /**
   * Number of pages.
   */
  pageCount: number;
  /**
   * Number of rows per page.
   */
  pageSize: number;
  /**
   * Number of all rows.
   */
  allRowsCount: number;
  /**
   * Sets current page to the given one.
   * Boundaries are automatically considered.
   */
  setPage: Dispatch<SetStateAction<number>>;
  /**
   * Sets page to the next page.
   */
  nextPage: () => void;
  /**
   * Sets page to the previous page.
   */
  previousPage: () => void;
  /**
   * Sets page to the last page.
   */
  lastPage: () => void;
  /**
   * Sets page to the first page.
   */
  firstPage: () => void;
  /**
   * Sets current page size (rows per page) to the given one.
   */
  setPageSize: Dispatch<SetStateAction<number>>;
};
