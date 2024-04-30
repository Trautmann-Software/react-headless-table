import { Context, useContext, useMemo } from 'react';
import { UseOptions } from '../types';
import { OptionsContext, OptionsContextProps } from '../internal/options-context';

/**
 * Hook that provides access to the options.
 * Options including CustomOptions can be referenced typesafe.
 * @template CustomOptions is the additional fields/attributes that were added into the options type definition.
 * @template CustomColumn is the additional type definitions of the column.
 * @template RowData is the generic row type.
 */
export function useOptions<
  CustomOptions extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  RowData extends Record<string, any> = {},
>(): UseOptions<CustomOptions, CustomColumn, RowData> {
  const options = useContext<OptionsContextProps<CustomOptions, CustomColumn, RowData>>(
    OptionsContext as Context<OptionsContextProps<CustomOptions, CustomColumn, RowData>>
  );
  return useMemo<UseOptions<CustomOptions, CustomColumn, RowData>>(() => options, [options]);
}
