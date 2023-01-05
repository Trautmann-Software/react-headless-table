import { createContext, PropsWithChildren, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { noop } from '../utils';
import { UseSearchQuery } from '../types';

type SearchContextProps = UseSearchQuery;

export const SearchContext = createContext<SearchContextProps>({
  searchQuery: '',
  deferredSearchQuery: '',
  setSearchQuery: noop,
});

type Props = PropsWithChildren<Pick<Partial<UseSearchQuery>, 'searchQuery'>>;

export function SearchContextProvider({ children, searchQuery: passedQuery = '' }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const deferredPassedSearchQuery = useDeferredValue(passedQuery);
  useEffect(() => setSearchQuery(deferredPassedSearchQuery), [deferredPassedSearchQuery]);

  const deferredSearchQuery = useDeferredValue(searchQuery);

  return useMemo(
    () => (
      <SearchContext.Provider value={{ searchQuery, deferredSearchQuery, setSearchQuery }}>
        {children}
      </SearchContext.Provider>
    ),
    [children, deferredSearchQuery, searchQuery]
  );
}
