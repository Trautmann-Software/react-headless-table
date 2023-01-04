import { createContext, PropsWithChildren, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { noop } from '../utils';
import { UseSearchQuery } from '../types';

type SearchContextProps = UseSearchQuery;

export const SearchContext = createContext<SearchContextProps>({
  searchQuery: '',
  setSearchQuery: noop,
});

type Props = PropsWithChildren<Pick<Partial<UseSearchQuery>, 'searchQuery'>>;

export function SearchContextProvider({ children, searchQuery: passedQuery = '' }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const deferredSearchQuery = useDeferredValue(passedQuery);
  useEffect(() => setSearchQuery(deferredSearchQuery), [deferredSearchQuery]);

  return useMemo(
    () => <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>{children}</SearchContext.Provider>,
    [children, searchQuery]
  );
}
