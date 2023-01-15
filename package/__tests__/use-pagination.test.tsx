import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { TestComponentProvider } from './test-component-provider';
import { usePagination } from '../src';
import { faker } from '@faker-js/faker';

type User = {
  username: string;
};

export function createRandomUser(): User {
  return {
    username: faker.internet.userName(),
  };
}

const testUsers = Array.from({ length: 25 }, () => createRandomUser());

function TestComponent() {
  const {
    pageRows,
    currentPage,
    pageSize,
    pageCount,
    allRowsCount,
    nextPage,
    lastPage,
    previousPage,
    firstPage,
    setPage,
    setPageSize,
  } = usePagination<User>();
  return (
    <>
      <ul>
        {pageRows.map((row) => (
          <li key={row.id} role="row">
            {row.data.username}
          </li>
        ))}
      </ul>
      <p role="current-page">{currentPage}</p>
      <p role="page-size">{pageSize}</p>
      <p role="page-count">{pageCount}</p>
      <p role="all-rows-count">{allRowsCount}</p>

      <button role="next-page" onClick={() => nextPage()} />
      <button role="last-page" onClick={() => lastPage()} />
      <button role="previous-page" onClick={() => previousPage()} />
      <button role="first-page" onClick={() => firstPage()} />
      <button role="page-5" onClick={() => setPage(5)} />
      <button role="page-size-10" onClick={() => setPageSize(10)} />
      <button role="page-size-25" onClick={() => setPageSize(25)} />
      <button role="page-size-12" onClick={() => setPageSize(12)} />
      <button role="page-size-6" onClick={() => setPageSize(6)} />
      <button role="page-size-5" onClick={() => setPageSize((prevState) => prevState - 1)} />
    </>
  );
}

test('usePagination hook performs correctly', async () => {
  render(
    <>
      <TestComponentProvider rows={testUsers}>
        <TestComponent />
      </TestComponentProvider>
    </>
  );

  let rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(5);
  testUsers.slice(0, 5).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('1');
  expect(screen.getByRole('page-size')).toHaveTextContent('5');
  expect(screen.getByRole('page-count')).toHaveTextContent('5');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('next-page'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(5);
  testUsers.slice(5, 10).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('2');
  expect(screen.getByRole('page-size')).toHaveTextContent('5');
  expect(screen.getByRole('page-count')).toHaveTextContent('5');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('last-page'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(5);
  testUsers.slice(20, 25).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('5');
  expect(screen.getByRole('page-size')).toHaveTextContent('5');
  expect(screen.getByRole('page-count')).toHaveTextContent('5');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('previous-page'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(5);
  testUsers.slice(15, 20).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('4');
  expect(screen.getByRole('page-size')).toHaveTextContent('5');
  expect(screen.getByRole('page-count')).toHaveTextContent('5');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('first-page'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(5);
  testUsers.slice(0, 5).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('1');
  expect(screen.getByRole('page-size')).toHaveTextContent('5');
  expect(screen.getByRole('page-count')).toHaveTextContent('5');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('page-5'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(5);
  testUsers.slice(20, 25).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('5');
  expect(screen.getByRole('page-size')).toHaveTextContent('5');
  expect(screen.getByRole('page-count')).toHaveTextContent('5');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('page-size-10'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(5);
  testUsers.slice(20, 25).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('3');
  expect(screen.getByRole('page-size')).toHaveTextContent('10');
  expect(screen.getByRole('page-count')).toHaveTextContent('3');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('page-size-25'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(25);
  testUsers.slice(0, 25).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('1');
  expect(screen.getByRole('page-size')).toHaveTextContent('25');
  expect(screen.getByRole('page-count')).toHaveTextContent('1');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('page-size-12'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(12);
  testUsers.slice(0, 12).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('1');
  expect(screen.getByRole('page-size')).toHaveTextContent('12');
  expect(screen.getByRole('page-count')).toHaveTextContent('3');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('next-page'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(12);
  testUsers.slice(12, 24).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('2');
  expect(screen.getByRole('page-size')).toHaveTextContent('12');
  expect(screen.getByRole('page-count')).toHaveTextContent('3');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('page-size-6'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(6);
  testUsers.slice(6, 12).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('2');
  expect(screen.getByRole('page-size')).toHaveTextContent('6');
  expect(screen.getByRole('page-count')).toHaveTextContent('5');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('last-page'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(1);
  testUsers.slice(24, 25).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('5');
  expect(screen.getByRole('page-size')).toHaveTextContent('6');
  expect(screen.getByRole('page-count')).toHaveTextContent('5');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');

  await userEvent.click(screen.getByRole('page-size-5'));
  rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(5);
  testUsers.slice(20, 25).forEach(({ username }, index) => expect(rows[index]).toHaveTextContent(username));
  expect(screen.getByRole('current-page')).toHaveTextContent('5');
  expect(screen.getByRole('page-size')).toHaveTextContent('5');
  expect(screen.getByRole('page-count')).toHaveTextContent('5');
  expect(screen.getByRole('all-rows-count')).toHaveTextContent('25');
});
