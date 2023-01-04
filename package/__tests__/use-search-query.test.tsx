import { useSearchQuery } from '../src';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { TestComponentProvider } from './test-component-provider';

function TestComponent() {
  const { searchQuery, setSearchQuery } = useSearchQuery();

  return (
    <input
      role="search-input"
      type="text"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
    />
  );
}

test('useSearchQuery hook delivers correct search query', async () => {
  render(
    <TestComponentProvider searchQuery="abc">
      <TestComponent />
    </TestComponentProvider>
  );

  expect(screen.getByRole('search-input')).toHaveValue('abc');
  await userEvent.type(screen.getByRole('search-input'), 'd');
  expect(screen.getByRole('search-input')).toHaveValue('abcd');
  await userEvent.clear(screen.getByRole('search-input'));
  expect(screen.getByRole('search-input')).toHaveValue('');
});
