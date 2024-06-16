import { useCallback, useContext, useMemo } from 'react';
import { UsePagination } from '../types';
import { PaginationContext } from '../internal/pagination-context';
import { useRows } from './use-rows';

const calculatePage = (page: number, max: number) => Math.max(1, Math.min(Math.ceil(page), max));

export function usePagination<RowData extends Record<string, any> = {}>(): UsePagination<RowData> {
  const { currentPage, setCurrentPage, pageSize, setPageSize } = useContext(PaginationContext);
  const { rows } = useRows<RowData>();

  const allRowsCount = rows.length;
  const pageCount = Math.ceil(allRowsCount / pageSize);

  const setPageCarefully = useCallback<UsePagination<RowData>['setPage']>(
    (value) => {
      if (typeof value === 'function') {
        setCurrentPage((prevState) => calculatePage(value(prevState), pageCount));
      } else {
        setCurrentPage(calculatePage(value, pageCount));
      }
    },
    [pageCount, setCurrentPage]
  );

  const nextPage = useCallback<UsePagination<RowData>['nextPage']>(
    () => setPageCarefully((previousPage) => previousPage + 1),
    [setPageCarefully]
  );

  const previousPage = useCallback<UsePagination<RowData>['previousPage']>(
    () => setPageCarefully((previousPage) => previousPage - 1),
    [setPageCarefully]
  );

  const lastPage = useCallback<UsePagination<RowData>['lastPage']>(
    () => setPageCarefully(pageCount),
    [pageCount, setPageCarefully]
  );

  const firstPage = useCallback<UsePagination<RowData>['firstPage']>(() => setPageCarefully(1), [setPageCarefully]);

  const pageRows = useMemo<UsePagination<RowData>['pageRows']>(
    () => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, pageSize, rows]
  );

  const setPageSizeCarefully = useCallback<UsePagination<RowData>['setPageSize']>(
    (value) => {
      if (typeof value === 'function') {
        setPageSize((prevState) => {
          const newPageSize = Math.max(1, Math.ceil(value(prevState)));
          setPageCarefully(calculatePage(currentPage, Math.ceil(allRowsCount / newPageSize)));
          return newPageSize;
        });
      } else {
        const newPageSize = Math.max(1, Math.ceil(value));
        setPageCarefully(calculatePage(currentPage, Math.ceil(allRowsCount / newPageSize)));
        setPageSize(newPageSize);
      }
    },
    [allRowsCount, currentPage, setPageCarefully, setPageSize]
  );

  return useMemo<UsePagination<RowData>>(
    () => ({
      pageRows,
      currentPage,
      pageCount,
      pageSize,
      allRowsCount,
      setPage: setPageCarefully,
      nextPage,
      previousPage,
      lastPage,
      firstPage,
      setPageSize: setPageSizeCarefully,
    }),
    [
      allRowsCount,
      currentPage,
      firstPage,
      lastPage,
      nextPage,
      pageCount,
      pageRows,
      pageSize,
      previousPage,
      setPageCarefully,
      setPageSizeCarefully,
    ]
  );
}
