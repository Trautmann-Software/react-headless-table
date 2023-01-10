import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestComponentProvider } from './test-component-provider';
import { useRows, useSearchQuery } from '../src';
import { Data, testColumns, testRows } from './test-data';
import userEvent from '@testing-library/user-event';

function TestComponent() {
  const { rows } = useRows<Data>();
  const { searchQuery, setSearchQuery } = useSearchQuery();

  return (
    <>
      <input
        role="search-input"
        type="text"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      <ul>
        {rows.map((row) => (
          <li key={row.id} role="rows" data-testid={`row-${row.data.username}`}>
            {row.data.username}
          </li>
        ))}
      </ul>
    </>
  );
}

test('useRows hook delivers rows that match current search query', async () => {
  render(
    <TestComponentProvider rows={testRows} columns={testColumns}>
      <TestComponent />
    </TestComponentProvider>
  );

  expect(screen.getByRole('search-input')).toHaveValue('');
  let rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(6);
  ['username-1', 'username-2', 'username-3', 'username-4', 'username-5', 'username-6'].forEach((username, index) =>
    expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`)
  );

  await userEvent.type(screen.getByRole('search-input'), 'username-5');
  expect(screen.getByRole('search-input')).toHaveValue('username-5');
  rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(1);
  ['username-5'].forEach((username, index) => expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`));

  await userEvent.clear(screen.getByRole('search-input'));
  expect(screen.getByRole('search-input')).toHaveValue('');
  rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(6);
  ['username-1', 'username-2', 'username-3', 'username-4', 'username-5', 'username-6'].forEach((username, index) =>
    expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`)
  );

  await userEvent.type(screen.getByRole('search-input'), 'tru');
  expect(screen.getByRole('search-input')).toHaveValue('tru');
  rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(2);
  ['username-2', 'username-6'].forEach((username, index) =>
    expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`)
  );

  await userEvent.clear(screen.getByRole('search-input'));
  expect(screen.getByRole('search-input')).toHaveValue('');
  rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(6);
  ['username-1', 'username-2', 'username-3', 'username-4', 'username-5', 'username-6'].forEach((username, index) =>
    expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`)
  );
});
