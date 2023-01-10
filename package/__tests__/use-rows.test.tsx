import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestComponentProvider } from './test-component-provider';
import { useRows } from '../src';
import { Data, testRows } from './test-data';

function TestComponent() {
  const { rows } = useRows<Data>();
  return (
    <>
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

test('useRows hook delivers correct rows', async () => {
  render(
    <TestComponentProvider rows={testRows}>
      <TestComponent />
    </TestComponentProvider>
  );

  const rows = screen.queryAllByRole('rows');
  expect(rows).toHaveLength(6);
  ['username-1', 'username-2', 'username-3', 'username-4', 'username-5', 'username-6'].forEach((username, index) =>
    expect(rows[index]).toHaveAttribute('data-testid', `row-${username}`)
  );
});
