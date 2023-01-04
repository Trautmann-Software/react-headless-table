import { useContext, useDeferredValue, useMemo } from 'react';
import { SearchContext } from '../internal/search-context';
import { UseSearchQuery } from '../types';

export function useSearchQuery(): UseSearchQuery {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  return useMemo<UseSearchQuery>(
    () => ({ searchQuery, deferredSearchQuery, setSearchQuery }),
    [deferredSearchQuery, searchQuery, setSearchQuery]
  );
}
