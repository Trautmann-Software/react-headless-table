import { useSearchQuery } from '../src';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { TestComponentProvider } from './test-component-provider';
import { Fragment } from 'react';

function TestComponent({ prefix }: { prefix: string }) {
  const { searchQuery, setSearchQuery } = useSearchQuery();

  return (
    <input
      role={`${prefix}-search-input`}
      type="text"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
    />
  );
}

test('useSearchQuery hook delivers correct search query', async () => {
  render(
    <Fragment>
      <TestComponentProvider searchQuery="abc">
        <TestComponent prefix="a" />
      </TestComponentProvider>
      <TestComponentProvider searchQuery="xyz">
        <TestComponent prefix="b" />
      </TestComponentProvider>
    </Fragment>
  );

  expect(screen.getByRole('a-search-input')).toHaveValue('abc');
  expect(screen.getByRole('b-search-input')).toHaveValue('xyz');
  await userEvent.type(screen.getByRole('a-search-input'), 'd');
  expect(screen.getByRole('a-search-input')).toHaveValue('abcd');
  expect(screen.getByRole('b-search-input')).toHaveValue('xyz');
  await userEvent.type(screen.getByRole('b-search-input'), 'a');
  expect(screen.getByRole('a-search-input')).toHaveValue('abcd');
  expect(screen.getByRole('b-search-input')).toHaveValue('xyza');
  await userEvent.clear(screen.getByRole('a-search-input'));
  expect(screen.getByRole('a-search-input')).toHaveValue('');
  expect(screen.getByRole('b-search-input')).toHaveValue('xyza');
  await userEvent.clear(screen.getByRole('b-search-input'));
  expect(screen.getByRole('a-search-input')).toHaveValue('');
  expect(screen.getByRole('b-search-input')).toHaveValue('');
});
