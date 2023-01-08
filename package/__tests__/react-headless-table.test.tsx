import { Column, useColumns, useSearchQuery } from '../src';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { TestComponentProvider } from './test-component-provider';
import { useRows } from '../src/hooks/use-rows';

type RowData = {
  stringField: string;
  multiStringField: Array<string>;
  booleanField: boolean;
  numberField: number;
  bigintField: bigint;
  dateField: Date;
  timeField: Date;
  dateTimeField: Date;
  relativeTimeField: number;
};

const columns: Array<Column<RowData>> = [
  { field: 'stringField', type: 'string' },
  { field: 'multiStringField', type: 'multi-string' },
  { field: 'booleanField', type: 'boolean' },
  { field: 'numberField', type: 'number' },
  { field: 'bigintField', type: 'bigint' },
  { field: 'dateField', type: 'date' },
  { field: 'timeField', type: 'time' },
  { field: 'dateTimeField', type: 'date-time' },
  { field: 'relativeTimeField', type: 'relative-time', relativeTimeFormatUnit: 'quarter' },
];

export const rows: Array<RowData> = [
  {
    stringField: 'string-1',
    multiStringField: [],
    booleanField: true,
    numberField: 100,
    bigintField: 11n,
    dateField: new Date('2023-06-01'),
    timeField: new Date('2023-01-01T01:02:03'),
    dateTimeField: new Date('2023-01-01T01:02:03'),
    relativeTimeField: 4,
  },
  {
    stringField: 'string-2',
    multiStringField: [],
    booleanField: false,
    numberField: 1,
    bigintField: 1n,
    dateField: new Date('2023-01-01'),
    timeField: new Date('2023-01-01T11:02:03'),
    dateTimeField: new Date('2023-01-01T01:02:02'),
    relativeTimeField: 3,
  },
  {
    stringField: 'string-3',
    multiStringField: [],
    booleanField: false,
    numberField: 112,
    bigintField: -64n,
    dateField: new Date('2023-07-01'),
    timeField: new Date('2023-01-01T14:02:03'),
    dateTimeField: new Date('2023-01-01T01:02:01'),
    relativeTimeField: 2,
  },
  {
    stringField: 'string-4',
    multiStringField: [],
    booleanField: true,
    numberField: -90,
    bigintField: 42n,
    dateField: new Date('2023-04-01'),
    timeField: new Date('2023-01-01T14:01:03'),
    dateTimeField: new Date('2023-01-02T01:02:03'),
    relativeTimeField: 2,
  },
  {
    stringField: 'string-5',
    multiStringField: [],
    booleanField: false,
    numberField: 11,
    bigintField: 400n,
    dateField: new Date('2023-11-01'),
    timeField: new Date('2023-01-01T12:02:03'),
    dateTimeField: new Date('2023-03-01T01:02:03'),
    relativeTimeField: 1,
  },
  {
    stringField: 'string-6',
    multiStringField: [],
    booleanField: true,
    numberField: 42,
    bigintField: 17n,
    dateField: new Date('2023-01-01'),
    timeField: new Date('2023-01-01T01:02:03'),
    dateTimeField: new Date('2024-01-01T01:02:03'),
    relativeTimeField: 4,
  },
];

function TestComponent() {
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const { columns } = useColumns<RowData>();
  const { rows } = useRows<RowData>();
  return (
    <>
      <input
        role="search-input"
        type="text"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      <table>
        <thead>
          <tr>
            {columns.map(({ field }) => (
              <td key={field} role="table-header" data-testid={`table-header-${field}`}>
                {field}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} role="table-row" data-testid={`table-row-${row.data.stringField}`}>
              {columns.map(({ field, value }) => (
                <td
                  key={field}
                  role={`table-row-${row.data.stringField}-cell`}
                  data-testid={`table-row-${row.data.stringField}-cell-${field}`}
                >
                  {value(row)?.toString() ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

test('react-headless-table provides correct data to render a table', async () => {
  render(
    <TestComponentProvider columns={columns} rows={rows}>
      <TestComponent />
    </TestComponentProvider>
  );

  //#region Initial state
  // Search input
  expect(screen.getByRole('search-input')).toHaveValue('');

  // Table columns/headers
  const tableHeaders = screen.getAllByRole('table-header');
  expect(tableHeaders).toHaveLength(9);
  [
    'stringField',
    'multiStringField',
    'booleanField',
    'numberField',
    'bigintField',
    'dateField',
    'timeField',
    'dateTimeField',
    'relativeTimeField',
  ].forEach((field, index) => expect(tableHeaders[index]).toHaveAttribute('data-testid', `table-header-${field}`));

  // Table rows
  const tableRows = screen.getAllByRole('table-row');
  expect(tableRows).toHaveLength(6);
  ['string-1', 'string-2', 'string-3', 'string-4', 'string-5', 'string-6'].forEach((field, index) =>
    expect(tableRows[index]).toHaveAttribute('data-testid', `table-row-${field}`)
  );

  // Table cells
  const tableCells = screen.getAllByRole('table-row-', { exact: false });
  expect(tableCells).toHaveLength(9 * 6);
  const tableCellsString1 = screen.getAllByRole('table-row-string-1-cell');
  expect(tableCellsString1).toHaveLength(9);
  [
    'stringField',
    'multiStringField',
    'booleanField',
    'numberField',
    'bigintField',
    'dateField',
    'timeField',
    'dateTimeField',
    'relativeTimeField',
  ].forEach((field, index) =>
    expect(tableCellsString1[index]).toHaveAttribute('data-testid', `table-row-string-1-cell-${field}`)
  );
  //#endregion Initial state

  // Search and check rows
  await userEvent.type(screen.getByRole('search-input'), 'string-1');
  expect(screen.getByRole('search-input')).toHaveValue('string-1');

  // Reset search input and check
  await userEvent.clear(screen.getByRole('search-input'));
  expect(screen.getByRole('search-input')).toHaveValue('');
});
