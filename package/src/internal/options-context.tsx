import { createContext, PropsWithChildren, useDeferredValue, useMemo } from 'react';
import { Options, UseOptions } from '../types';
import { v4 as uuid } from 'uuid';

/**
 * @template CustomOptions is the additional fields/attributes that were added into the options type definition.
 * @template CustomColumn is the additional type definitions of the column.
 * @template RowData is the generic row type.
 */
export type OptionsContextProps<
  CustomOptions extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  RowData extends Record<string, any> = {}
> = UseOptions<CustomOptions, CustomColumn, RowData>;

const idFn = () => uuid();

const defaultOptions: OptionsContextProps = {
  internationalizationOptions: {
    collatorOptions: {},
    numberFormatOptions: {},
    bigintFormatOptions: {},
    dateFormatOptions: {},
    timeFormatOptions: {},
    dateTimeFormatOptions: {},
    relativeTimeFormatOptions: {},
    booleanFormatOptions: {
      true: 'true',
      false: 'false',
      empty: '',
    },
  },
  rowOptions: {
    idFn,
    detailsPanelType: 'single',
  },
};

export const OptionsContext = createContext<OptionsContextProps>(defaultOptions);

/**
 * @template CustomOptions is the additional fields/attributes that were added into the options type definition.
 * @template CustomColumn is the additional type definitions of the column.
 * @template RowData is the generic row type.
 */
type Props<
  CustomOptions extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  RowData extends Record<string, any> = {}
> = PropsWithChildren<{
  options?: Options<CustomOptions, CustomColumn, RowData>;
}>;

/**
 * @template CustomOptions is the additional fields/attributes that were added into the options type definition.
 * @template CustomColumn is the additional type definitions of the column.
 * @template RowData is the generic row type.
 */
export function OptionsContextProvider<
  CustomOptions extends Record<string, any> = {},
  CustomColumn extends Record<string, any> = {},
  RowData extends Record<string, any> = {}
>(props: Props<CustomOptions, CustomColumn, RowData>) {
  const { children, options: passedOptions } = props;
  const deferredOptions = useDeferredValue(passedOptions);
  const options = useMemo<OptionsContextProps<CustomOptions, CustomColumn, RowData>>(
    () => ({
      ...((deferredOptions ?? {}) as CustomOptions),
      internationalizationOptions: {
        ...defaultOptions.internationalizationOptions,
        ...(deferredOptions?.internationalizationOptions ?? {}),
      },
      rowOptions: {
        ...defaultOptions.rowOptions,
        ...(deferredOptions?.rowOptions ?? {}),
      },
    }),
    [deferredOptions]
  );

  return useMemo(
    () => <OptionsContext.Provider value={options}>{children}</OptionsContext.Provider>,
    [children, options]
  );
}
