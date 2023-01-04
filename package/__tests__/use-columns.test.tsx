import { Column, useColumns } from '../src';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { TestComponentProvider } from './test-component-provider';
import { CustomColumn, Data } from './test-data';

const columns: Array<Column<Data, CustomColumn>> = [
  { field: 'string', type: 'string', customColumnField: 'customColumnFieldValue' },
  { field: 'multi-string', type: 'multi-string', customColumnField: 'customColumnFieldValue' },
  { field: 'boolean', type: 'boolean', hidden: true, customColumnField: 'customColumnFieldValue' },
  { field: 'number', type: 'number', customColumnField: 'customColumnFieldValue' },
  { field: 'bigint', type: 'bigint', order: 42, customColumnField: 'customColumnFieldValue' },
  { field: 'date', type: 'date', customColumnField: 'customColumnFieldValue' },
  { field: 'time', type: 'time', customColumnField: 'customColumnFieldValue' },
  { field: 'date-time', type: 'date-time', customColumnField: 'customColumnFieldValue' },
  {
    field: 'relative-time',
    type: 'relative-time',
    relativeTimeFormatUnit: 'quarter',
    customColumnField: 'customColumnFieldValue',
    customOptionalColumnField: 'customOptionalColumnFieldValue',
  },
];

function TestComponent() {
  const {
    allColumns,
    visibleColumns,
    orderedVisibleColumns,
    hideColumn,
    showColumn,
    toggleColumnVisibility,
    swapColumnOrder,
  } = useColumns<Data, CustomColumn>();

  return (
    <>
      <ul>
        {allColumns.map((column) => (
          <li key={column.field} role="columns" data-testid={`column-${column.field}`}>
            <span role={column.customColumnField}>{column.customColumnField}</span>
            <span role={column.customOptionalColumnField}>{column.customOptionalColumnField}</span>
          </li>
        ))}
      </ul>
      <ul>
        {visibleColumns.map((column) => (
          <li key={column.field} role="visible-columns" data-testid={`visible-column-${column.field}`}>
            {column.field}
          </li>
        ))}
      </ul>
      <ul>
        {orderedVisibleColumns.map((column) => (
          <li key={column.field} role="ordered-visible-columns" data-testid={`ordered-visible-column-${column.field}`}>
            {column.field}
          </li>
        ))}
      </ul>

      <button role="show-boolean-field" onClick={() => showColumn('boolean')}>
        show-boolean-field
      </button>
      <button role="hide-number-field" onClick={() => hideColumn('number')}>
        hide-number-field
      </button>
      <button role="toggle-string-field" onClick={() => toggleColumnVisibility('string')}>
        toggle-string-field
      </button>
      <button role="multi-string-and-bigint-fields" onClick={() => swapColumnOrder('multi-string', 'bigint')}>
        multi-string-and-bigint-fields
      </button>
    </>
  );
}

test('useColumns hook delivers correct columns', async () => {
  render(
    <TestComponentProvider columns={columns}>
      <TestComponent />
    </TestComponentProvider>
  );

  // allColumns always contains all columns independent of everything
  let allColumns = screen.getAllByRole('columns');
  expect(allColumns).toHaveLength(9);
  ['string', 'multi-string', 'boolean', 'number', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach(
    (id, index) => expect(allColumns[index]).toHaveAttribute('data-testid', `column-${id}`)
  );
  // visibleColumns contains only currently visible columns in the same order as allColumns
  let visibleColumns = screen.getAllByRole('visible-columns');
  expect(visibleColumns).toHaveLength(8);
  ['string', 'multi-string', 'number', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach((id, index) =>
    expect(visibleColumns[index]).toHaveAttribute('data-testid', `visible-column-${id}`)
  );
  ['boolean'].forEach((id) => expect(screen.queryByTestId(`visible-column-${id}`)).not.toBeInTheDocument());
  // orderedVisibleColumns contains only currently visible columns ordered by currently order state
  let orderedVisibleColumns = screen.getAllByRole('ordered-visible-columns');
  expect(orderedVisibleColumns).toHaveLength(8);
  ['string', 'multi-string', 'number', 'date', 'time', 'date-time', 'relative-time', 'bigint'].forEach((id, index) =>
    expect(orderedVisibleColumns[index]).toHaveAttribute('data-testid', `ordered-visible-column-${id}`)
  );
  ['boolean'].forEach((id) => expect(screen.queryByTestId(`ordered-visible-column-${id}`)).not.toBeInTheDocument());

  // Show initially hidden boolean column
  await userEvent.click(screen.getByRole('show-boolean-field'));
  // allColumns always contains all columns independent of everything
  allColumns = screen.getAllByRole('columns');
  expect(allColumns).toHaveLength(9);
  ['string', 'multi-string', 'boolean', 'number', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach(
    (id, index) => expect(allColumns[index]).toHaveAttribute('data-testid', `column-${id}`)
  );
  // visibleColumns contains only currently visible columns in the same order as allColumns
  visibleColumns = screen.getAllByRole('visible-columns');
  expect(visibleColumns).toHaveLength(9);
  ['string', 'multi-string', 'boolean', 'number', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach(
    (id, index) => expect(visibleColumns[index]).toHaveAttribute('data-testid', `visible-column-${id}`)
  );
  // orderedVisibleColumns contains only currently visible columns ordered by currently order state
  orderedVisibleColumns = screen.getAllByRole('ordered-visible-columns');
  expect(orderedVisibleColumns).toHaveLength(9);
  ['string', 'multi-string', 'boolean', 'number', 'date', 'time', 'date-time', 'relative-time', 'bigint'].forEach(
    (id, index) => expect(orderedVisibleColumns[index]).toHaveAttribute('data-testid', `ordered-visible-column-${id}`)
  );

  // Hide the visible number column
  await userEvent.click(screen.getByRole('hide-number-field'));
  // allColumns always contains all columns independent of everything
  allColumns = screen.getAllByRole('columns');
  expect(allColumns).toHaveLength(9);
  ['string', 'multi-string', 'boolean', 'number', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach(
    (id, index) => expect(allColumns[index]).toHaveAttribute('data-testid', `column-${id}`)
  );
  // visibleColumns contains only currently visible columns in the same order as allColumns
  visibleColumns = screen.getAllByRole('visible-columns');
  expect(visibleColumns).toHaveLength(8);
  ['string', 'multi-string', 'boolean', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach((id, index) =>
    expect(visibleColumns[index]).toHaveAttribute('data-testid', `visible-column-${id}`)
  );
  ['number'].forEach((id) => expect(screen.queryByTestId(`visible-column-${id}`)).not.toBeInTheDocument());
  // orderedVisibleColumns contains only currently visible columns ordered by currently order state
  orderedVisibleColumns = screen.getAllByRole('ordered-visible-columns');
  expect(orderedVisibleColumns).toHaveLength(8);
  ['string', 'multi-string', 'boolean', 'date', 'time', 'date-time', 'relative-time', 'bigint'].forEach((id, index) =>
    expect(orderedVisibleColumns[index]).toHaveAttribute('data-testid', `ordered-visible-column-${id}`)
  );
  ['number'].forEach((id) => expect(screen.queryByTestId(`ordered-visible-column-${id}`)).not.toBeInTheDocument());

  // Toggle the visible of the string column => hide
  await userEvent.click(screen.getByRole('toggle-string-field'));
  // allColumns always contains all columns independent of everything
  allColumns = screen.getAllByRole('columns');
  expect(allColumns).toHaveLength(9);
  ['string', 'multi-string', 'boolean', 'number', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach(
    (id, index) => expect(allColumns[index]).toHaveAttribute('data-testid', `column-${id}`)
  );
  // visibleColumns contains only currently visible columns in the same order as allColumns
  visibleColumns = screen.getAllByRole('visible-columns');
  expect(visibleColumns).toHaveLength(7);
  ['multi-string', 'boolean', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach((id, index) =>
    expect(visibleColumns[index]).toHaveAttribute('data-testid', `visible-column-${id}`)
  );
  ['string', 'number'].forEach((id) => expect(screen.queryByTestId(`visible-column-${id}`)).not.toBeInTheDocument());
  // orderedVisibleColumns contains only currently visible columns ordered by currently order state
  orderedVisibleColumns = screen.getAllByRole('ordered-visible-columns');
  expect(orderedVisibleColumns).toHaveLength(7);
  ['multi-string', 'boolean', 'date', 'time', 'date-time', 'relative-time', 'bigint'].forEach((id, index) =>
    expect(orderedVisibleColumns[index]).toHaveAttribute('data-testid', `ordered-visible-column-${id}`)
  );
  ['string', 'number'].forEach((id) =>
    expect(screen.queryByTestId(`ordered-visible-column-${id}`)).not.toBeInTheDocument()
  );

  // Toggle the visible of the string column => show
  await userEvent.click(screen.getByRole('toggle-string-field'));
  // allColumns always contains all columns independent of everything
  allColumns = screen.getAllByRole('columns');
  expect(allColumns).toHaveLength(9);
  ['string', 'multi-string', 'boolean', 'number', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach(
    (id, index) => expect(allColumns[index]).toHaveAttribute('data-testid', `column-${id}`)
  );
  // visibleColumns contains only currently visible columns in the same order as allColumns
  visibleColumns = screen.getAllByRole('visible-columns');
  expect(visibleColumns).toHaveLength(8);
  ['string', 'multi-string', 'boolean', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach((id, index) =>
    expect(visibleColumns[index]).toHaveAttribute('data-testid', `visible-column-${id}`)
  );
  ['number'].forEach((id) => expect(screen.queryByTestId(`visible-column-${id}`)).not.toBeInTheDocument());
  // orderedVisibleColumns contains only currently visible columns ordered by currently order state
  orderedVisibleColumns = screen.getAllByRole('ordered-visible-columns');
  expect(orderedVisibleColumns).toHaveLength(8);
  ['string', 'multi-string', 'boolean', 'date', 'time', 'date-time', 'relative-time', 'bigint'].forEach((id, index) =>
    expect(orderedVisibleColumns[index]).toHaveAttribute('data-testid', `ordered-visible-column-${id}`)
  );
  ['number'].forEach((id) => expect(screen.queryByTestId(`ordered-visible-column-${id}`)).not.toBeInTheDocument());

  // Swap the order of the columns: multi-string <=> bigint
  await userEvent.click(screen.getByRole('multi-string-and-bigint-fields'));
  // New order: 'string', 'bigint', 'boolean', 'number', 'multi-string', 'date', 'time', 'date-time', 'relative-time'
  // allColumns always contains all columns independent of everything
  allColumns = screen.getAllByRole('columns');
  expect(allColumns).toHaveLength(9);
  ['string', 'multi-string', 'boolean', 'number', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach(
    (id, index) => expect(allColumns[index]).toHaveAttribute('data-testid', `column-${id}`)
  );
  // visibleColumns contains only currently visible columns in the same order as allColumns
  visibleColumns = screen.getAllByRole('visible-columns');
  expect(visibleColumns).toHaveLength(8);
  ['string', 'multi-string', 'boolean', 'bigint', 'date', 'time', 'date-time', 'relative-time'].forEach((id, index) =>
    expect(visibleColumns[index]).toHaveAttribute('data-testid', `visible-column-${id}`)
  );
  ['number'].forEach((id) => expect(screen.queryByTestId(`visible-column-${id}`)).not.toBeInTheDocument());
  // orderedVisibleColumns contains only currently visible columns ordered by currently order state
  orderedVisibleColumns = screen.getAllByRole('ordered-visible-columns');
  expect(orderedVisibleColumns).toHaveLength(8);
  ['string', 'bigint', 'boolean', 'date', 'time', 'date-time', 'relative-time', 'multi-string'].forEach((id, index) =>
    expect(orderedVisibleColumns[index]).toHaveAttribute('data-testid', `ordered-visible-column-${id}`)
  );
  ['number'].forEach((id) => expect(screen.queryByTestId(`ordered-visible-column-${id}`)).not.toBeInTheDocument());

  // Custom column fields
  expect(screen.getAllByRole('customColumnFieldValue')).toHaveLength(9);
  expect(screen.getAllByRole('customOptionalColumnFieldValue')).toHaveLength(1);
});
