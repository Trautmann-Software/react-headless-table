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
import { noop } from '../utils';
import { UsePagination } from '../types';
import { useOptions } from '../hooks';

type PaginationContextProps = Pick<UsePagination, 'currentPage' | 'pageSize'> & {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
};

export const PaginationContext = createContext<PaginationContextProps>({
  currentPage: 1,
  setCurrentPage: noop,
  pageSize: 5,
  setPageSize: noop,
});

type Props = PropsWithChildren<{}>;

export function PaginationContextProvider({ children }: Props) {
  const { paginationOptions } = useOptions();

  const [currentPage, setCurrentPage] = useState(1);
  const deferredCurrentPage = useDeferredValue(paginationOptions.currentPage);
  useEffect(() => setCurrentPage(deferredCurrentPage), [deferredCurrentPage]);

  const [pageSize, setPageSize] = useState(1);
  const deferredPageSize = useDeferredValue(paginationOptions.pageSize);
  useEffect(() => setPageSize(deferredPageSize), [deferredPageSize]);

  return useMemo(
    () => (
      <PaginationContext.Provider value={{ currentPage, setCurrentPage, pageSize, setPageSize }}>
        {children}
      </PaginationContext.Provider>
    ),
    [children, currentPage, pageSize]
  );
}
