import { Dispatch, SetStateAction } from 'react';

export type UseSearchQuery = {
  /**
   * Current search query.
   * This value should be used to show in an input field.
   */
  searchQuery: string;
  /**
   * Deferred search query.
   * This value should be used as dependency and value for computation heavy operations.
   */
  deferredSearchQuery: string;
  /**
   * Setter for the search query.
   */
  setSearchQuery: Dispatch<SetStateAction<string>>;
};
