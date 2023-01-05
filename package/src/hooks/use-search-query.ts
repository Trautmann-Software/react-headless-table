import { useContext, useMemo } from 'react';
import { SearchContext } from '../internal/search-context';
import { UseSearchQuery } from '../types';

export function useSearchQuery(): UseSearchQuery {
  const { searchQuery, deferredSearchQuery, setSearchQuery } = useContext(SearchContext);
  return useMemo<UseSearchQuery>(
    () => ({ searchQuery, deferredSearchQuery, setSearchQuery }),
    [deferredSearchQuery, searchQuery, setSearchQuery]
  );
}
