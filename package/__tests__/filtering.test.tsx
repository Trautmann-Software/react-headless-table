import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestComponentProvider } from './test-component-provider';
import { useRows } from '../src/hooks/use-rows';
import { CustomFilter, Data, testColumns, testRows } from './test-data';
import userEvent from '@testing-library/user-event';
import { useFilters } from '../src/hooks/use-filters';

function TestComponent() {
  const { rows } = useRows<Data>();
  const { addFilter, updateFilter, removeFilter } = useFilters<{}, Data>();

  return (
    <>
      <ul>
        {rows.map((row) => (
          <li key={row.id} role="rows" data-testid={`row-${row.data.username}`}>
            {row.data.username}
          </li>
        ))}
      </ul>

      <button
        role="add-filter"
        onClick={() =>
          addFilter({
            id: 'added',
            chainAs: 'MUST',
            columnId: 'age',
            operator: (row) => row.data.age >= 30,
          })
        }
      >
        add-filter
      </button>
      <button
        role="update-filter"
        onClick={() =>
          updateFilter({
            id: 'added',
            chainAs: 'MUST',
            columnId: 'age',
            operator: (row) => row.data.age >= 15,
          })
        }
      >
        update-filter
      </button>
      <button
        role="remove-filters"
        onClick={() => {
          removeFilter('added');
          removeFilter('vip');
        }}
      >
        remove-filter
      </button>
    </>
  );
}

test('useRows hook delivers rows that match current search query', async () => {
  render(
    <TestComponentProvider<Data>
      rows={testRows}
      columns={testColumns}
      filters={[{ id: 'vip', operator: (row) => row.data.vip }]}
    >
      <TestComponent />
    </TestComponentProvider>
  );

  let rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(2);
  ['username-2', 'username-6'].forEach((username, index) =>
    expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`)
  );

  await userEvent.click(screen.getByRole('add-filter'));
  rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(1);
  ['username-6'].forEach((username, index) => expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`));

  await userEvent.click(screen.getByRole('update-filter'));
  rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(2);
  ['username-2', 'username-6'].forEach((username, index) =>
    expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`)
  );

  await userEvent.click(screen.getByRole('remove-filters'));
  rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(6);
  ['username-1', 'username-2', 'username-3', 'username-4', 'username-5', 'username-6'].forEach((username, index) =>
    expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`)
  );
});
