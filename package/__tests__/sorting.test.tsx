import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestComponentProvider } from './test-component-provider';
import { useColumns, useRows } from '../src';
import { Data, testColumns, testRows } from './test-data';
import userEvent from '@testing-library/user-event';
import { Fragment } from 'react';

function TestComponent() {
  const { rows } = useRows<Data>();
  const { sort, toggleSort } = useColumns();

  return (
    <Fragment>
      <ul>
        {rows.map((row) => (
          <li key={row.id} role="rows" data-testid={`row-${row.data.username}`}>
            {row.data.username}
          </li>
        ))}
      </ul>
      {/* Sorting */}
      <button role="sort-username-desc" onClick={() => sort('username', 'desc')}>
        sort-username-desc
      </button>
      <button role="toggle-sort-age" onClick={() => toggleSort('age')}>
        toggle-sort-age
      </button>
    </Fragment>
  );
}

test('useRows hook delivers sorted rows after changing sorting', async () => {
  render(
    <TestComponentProvider rows={testRows} columns={testColumns}>
      <TestComponent />
    </TestComponentProvider>
  );

  let rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(6);
  ['username-1', 'username-2', 'username-3', 'username-4', 'username-5', 'username-6'].forEach((username, index) =>
    expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`)
  );

  await userEvent.click(screen.getByRole('sort-username-desc'));
  rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(6);
  ['username-6', 'username-5', 'username-4', 'username-3', 'username-2', 'username-1'].forEach((username, index) =>
    expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`)
  );

  await userEvent.click(screen.getByRole('toggle-sort-age'));
  rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(6);
  ['username-1', 'username-2', 'username-3', 'username-6', 'username-4', 'username-5'].forEach((username, index) =>
    expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`)
  );
});
