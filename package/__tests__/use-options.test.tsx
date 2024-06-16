import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestComponentProvider } from './test-component-provider';
import { CustomColumn, CustomOptions, Data } from './test-data';
import { useOptions } from '../src';
import { Fragment } from 'react';

function TestComponent() {
  const { internationalizationOptions, rowOptions, paginationOptions, ...customOptions } = useOptions<
    CustomOptions,
    CustomColumn,
    Data
  >();
  return (
    <Fragment>
      <ul role="internationalizationOptions">
        <li data-testid="internationalizationOptions-locale">{internationalizationOptions.locale}</li>
        <li data-testid="internationalizationOptions-collatorOptions">
          {Object.entries(internationalizationOptions.collatorOptions ?? {})
            .map(([key, value]) => `${key}:${value}`)
            .sort()
            .join(',')}
        </li>
        <li data-testid="internationalizationOptions-numberFormatOptions">
          {Object.entries(internationalizationOptions.numberFormatOptions ?? {})
            .map(([key, value]) => `${key}:${value}`)
            .sort()
            .join(',')}
        </li>
        <li data-testid="internationalizationOptions-bigintFormatOptions">
          {Object.entries(internationalizationOptions.bigintFormatOptions ?? {})
            .map(([key, value]) => `${key}:${value}`)
            .sort()
            .join(',')}
        </li>
        <li data-testid="internationalizationOptions-dateFormatOptions">
          {Object.entries(internationalizationOptions.dateFormatOptions ?? {})
            .map(([key, value]) => `${key}:${value}`)
            .sort()
            .join(',')}
        </li>
        <li data-testid="internationalizationOptions-timeFormatOptions">
          {Object.entries(internationalizationOptions.timeFormatOptions ?? {})
            .map(([key, value]) => `${key}:${value}`)
            .sort()
            .join(',')}
        </li>
        <li data-testid="internationalizationOptions-dateTimeFormatOptions">
          {Object.entries(internationalizationOptions.dateTimeFormatOptions ?? {})
            .map(([key, value]) => `${key}:${value}`)
            .sort()
            .join(',')}
        </li>
        <li data-testid="internationalizationOptions-relativeTimeFormatOptions">
          {Object.entries(internationalizationOptions.relativeTimeFormatOptions ?? {})
            .map(([key, value]) => `${key}:${value}`)
            .sort()
            .join(',')}
        </li>
        <li data-testid="internationalizationOptions-booleanFormatOptions">
          {Object.entries(internationalizationOptions.booleanFormatOptions ?? {})
            .map(([key, value]) => `${key}:${value}`)
            .sort()
            .join(',')}
        </li>
      </ul>
      <ul role="rowOptions">
        <li data-testid="rowOptions-detailsPanelType">{rowOptions.detailsPanelType}</li>
      </ul>
      <li data-testid="paginationOptions">
        {Object.entries(paginationOptions ?? {})
          .map(([key, value]) => `${key}:${value}`)
          .sort()
          .join(',')}
      </li>
      <p role="customOptions" data-testid="customOptions">
        {Object.entries(customOptions)
          .map(([key, value]) => `${key}:${value}`)
          .sort()
          .join(',')}
      </p>
    </Fragment>
  );
}

test('useOptions hook delivers default options if no options passed', async () => {
  render(
    <TestComponentProvider key="no-options">
      <TestComponent />
    </TestComponentProvider>
  );
  // internationalizationOptions
  expect(screen.getByTestId('internationalizationOptions-locale')).toHaveTextContent('');
  expect(screen.getByTestId('internationalizationOptions-collatorOptions')).toHaveTextContent('');
  expect(screen.getByTestId('internationalizationOptions-numberFormatOptions')).toHaveTextContent('');
  expect(screen.getByTestId('internationalizationOptions-bigintFormatOptions')).toHaveTextContent('');
  expect(screen.getByTestId('internationalizationOptions-dateFormatOptions')).toHaveTextContent('');
  expect(screen.getByTestId('internationalizationOptions-timeFormatOptions')).toHaveTextContent('');
  expect(screen.getByTestId('internationalizationOptions-dateTimeFormatOptions')).toHaveTextContent('');
  expect(screen.getByTestId('internationalizationOptions-relativeTimeFormatOptions')).toHaveTextContent('');
  expect(screen.getByTestId('internationalizationOptions-booleanFormatOptions')).toHaveTextContent(
    'empty:,false:false,true:true'
  );
  // rowOptions
  expect(screen.getByTestId('rowOptions-detailsPanelType')).toHaveTextContent('single');
  // paginationOptions
  expect(screen.getByTestId('paginationOptions')).toHaveTextContent('currentPage:1,pageSize:5');
});

test('useOptions hook delivers default options merged with option overrides', async () => {
  render(
    <TestComponentProvider
      key="options"
      options={{
        emptyRenderValue: '-',
        internationalizationOptions: {
          locale: 'es',
          collatorOptions: {
            caseFirst: 'upper',
          },
          numberFormatOptions: {
            style: 'percent',
            notation: 'compact',
          },
          bigintFormatOptions: {
            style: 'currency',
            currency: 'EUR',
          },
          dateFormatOptions: {
            dateStyle: 'full',
          },
          timeFormatOptions: {
            timeStyle: 'full',
          },
          dateTimeFormatOptions: {
            dateStyle: 'full',
            timeStyle: 'full',
          },
          relativeTimeFormatOptions: {
            style: 'narrow',
          },
          booleanFormatOptions: {
            true: 'yes',
            false: 'no',
            empty: 'unknown',
          },
        },
        rowOptions: {
          detailsPanelType: 'multiple',
        },
        paginationOptions: {
          currentPage: 2,
          pageSize: 10,
        },
      }}
    >
      <TestComponent />
    </TestComponentProvider>
  );
  // internationalizationOptions
  expect(screen.getByTestId('internationalizationOptions-locale')).toHaveTextContent('es');
  expect(screen.getByTestId('internationalizationOptions-collatorOptions')).toHaveTextContent('caseFirst:upper');
  expect(screen.getByTestId('internationalizationOptions-numberFormatOptions')).toHaveTextContent(
    'notation:compact,style:percent'
  );
  expect(screen.getByTestId('internationalizationOptions-bigintFormatOptions')).toHaveTextContent(
    'currency:EUR,style:currency'
  );
  expect(screen.getByTestId('internationalizationOptions-dateFormatOptions')).toHaveTextContent('dateStyle:full');
  expect(screen.getByTestId('internationalizationOptions-timeFormatOptions')).toHaveTextContent('timeStyle:full');
  expect(screen.getByTestId('internationalizationOptions-dateTimeFormatOptions')).toHaveTextContent(
    'dateStyle:full,timeStyle:full'
  );
  expect(screen.getByTestId('internationalizationOptions-relativeTimeFormatOptions')).toHaveTextContent('style:narrow');
  expect(screen.getByTestId('internationalizationOptions-booleanFormatOptions')).toHaveTextContent(
    'empty:unknown,false:no,true:yes'
  );
  // rowOptions
  expect(screen.getByTestId('rowOptions-detailsPanelType')).toHaveTextContent('multiple');
  // paginationOptions
  expect(screen.getByTestId('paginationOptions')).toHaveTextContent('currentPage:2,pageSize:10');
});

test('useOptions hook delivers default options merged with option overrides', async () => {
  render(
    <TestComponentProvider<Data, CustomColumn, CustomOptions<CustomColumn, Data>>
      key="options"
      options={{
        customOptionField: 'customValue',
        customOptionalOptionField: 'customOptionsValue',
        customFn: (column, row) => !!column && !!row.data,
        rowOptions: {
          detailsPanelType: 'multiple',
        },
      }}
    >
      <TestComponent />
    </TestComponentProvider>
  );
  // customOptions
  expect(screen.getByTestId('customOptions')).toHaveTextContent(
    'customOptionField:customValue,customOptionalOptionField:customOptionsValue'
  );
  // rowOptions
  expect(screen.getByTestId('rowOptions-detailsPanelType')).toHaveTextContent('multiple');
});
