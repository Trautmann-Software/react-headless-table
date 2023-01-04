import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestComponentProvider } from './test-component-provider';
import { useRows } from '../src/hooks/use-rows';
import { Data } from './test-data';

export const rows: Array<Data> = [
  { name: 'Name 1' },
  { name: 'Name 2' },
  { name: 'Name 3' },
  { name: 'Name 4' },
  { name: 'Name 5' },
];

function TestComponent() {
  const { allRows, filteredRows, sortedRows } = useRows<Data>();

  return (
    <>
      <ul>
        {allRows.map((row) => (
          <li key={row.id} role="rows" data-testid={`row-${row.data.name}`}>
            {row.data.name}
          </li>
        ))}
      </ul>
      <ul>
        {filteredRows.map((row) => (
          <li key={row.id} role="filtered-rows" data-testid={`filtered-row-${row.data.name}`}>
            {row.data.name}
          </li>
        ))}
      </ul>
      <ul>
        {sortedRows.map((row) => (
          <li key={row.id} role="sorted-rows" data-testid={`sorted-row-${row.data.name}`}>
            {row.data.name}
          </li>
        ))}
      </ul>
    </>
  );
}

test('useRows hook delivers correct rows', async () => {
  render(
    <TestComponentProvider rows={rows}>
      <TestComponent />
    </TestComponentProvider>
  );

  // allRows always contains all rows independent of everything
  expect(screen.queryAllByRole('rows')).toHaveLength(5);
  ['Name 1', 'Name 2', 'Name 3', 'Name 4', 'Name 5'].forEach((id) =>
    expect(screen.queryByTestId(`row-${id}`)).toBeInTheDocument()
  );
  // filteredRows contains only rows that match to the current search query and current set of filters
  /*expect(screen.queryAllByRole('filtered-rows')).toHaveLength(5);
  ['field1', 'field2', 'field4', 'field5'].forEach((id) =>
    expect(screen.queryByTestId(`filtered-row-${id}`)).toBeInTheDocument()
  );
  ['field3'].forEach((id) => expect(screen.queryByTestId(`filtered-row-${id}`)).not.toBeInTheDocument());*/
  // sortedRows contains only filteredRows rows ordered by current sorting state
  /*expect(screen.queryAllByRole('sorted-rows')).toHaveLength(5);
  ['field1', 'field2', 'field4', 'field5'].forEach((id) =>
    expect(screen.queryByTestId(`sorted-row-${id}`)).toBeInTheDocument()
  );
  ['field3'].forEach((id) => expect(screen.queryByTestId(`sorted-row-${id}`)).not.toBeInTheDocument());*/
});
