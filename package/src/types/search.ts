import { Dispatch, SetStateAction } from 'react';

export type UseSearchQuery = {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
};
