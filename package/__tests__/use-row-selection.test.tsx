import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { TestComponentProvider } from './test-component-provider';
import { useRows, useRowSelection } from '../src';
import { testRows } from './test-data';
import { defined, equals } from '../src/utils';
import { Fragment } from 'react';

function TestComponent() {
  const {
    selectedRowIds,
    select,
    deselect,
    selectMultiple,
    deselectMultiple,
    selectAll,
    deselectAll,
    hasSelectedRows,
    allSelected,
  } = useRowSelection();
  const { rows } = useRows();
  return (
    <Fragment>
      <ul>
        {Array.from(selectedRowIds).map((rowId) => (
          <li key={rowId} role="selected-row-id">
            {rowId}
          </li>
        ))}
      </ul>
      <div role="has-selected-rows">{String(hasSelectedRows)}</div>
      <div role="all-selected">{String(allSelected)}</div>
      <ul>
        {rows.map((row) => (
          <li key={row.id} role={row.selected ? 'selected-row' : 'deselected-row'}>
            {row.id}
          </li>
        ))}
      </ul>

      <button role="select" onClick={() => select(rows[0].id)} />
      <button role="select-multiple" onClick={() => selectMultiple([rows[2].id, rows[3].id])} />
      <button role="deselect" onClick={() => deselect(rows[2].id)} />
      <button role="deselect-multiple" onClick={() => deselectMultiple([rows[0].id, rows[3].id])} />
      <button role="select-all" onClick={() => selectAll()} />
      <button role="deselect-all" onClick={() => deselectAll()} />
    </Fragment>
  );
}

test('useRowSelection hook performs correctly', async () => {
  render(
    <Fragment>
      <TestComponentProvider rows={testRows}>
        <TestComponent />
      </TestComponentProvider>
    </Fragment>
  );

  expect(screen.queryAllByRole('selected-row-id')).toHaveLength(0);
  expect(screen.getByRole('has-selected-rows')).toHaveTextContent('false');
  expect(screen.getByRole('all-selected')).toHaveTextContent('false');
  expect(screen.queryAllByRole('selected-row')).toHaveLength(0);
  expect(screen.queryAllByRole('deselected-row')).toHaveLength(6);

  await userEvent.click(screen.getByRole('select'));
  expect(screen.queryAllByRole('selected-row-id')).toHaveLength(1);
  expect(screen.getByRole('has-selected-rows')).toHaveTextContent('true');
  expect(screen.getByRole('all-selected')).toHaveTextContent('false');
  expect(screen.queryAllByRole('selected-row')).toHaveLength(1);
  expect(screen.queryAllByRole('deselected-row')).toHaveLength(5);
  expect(
    equals(
      screen
        .queryAllByRole('selected-row-id')
        .map((row) => row.textContent)
        .filter(defined)
        .sort(),
      screen
        .queryAllByRole('selected-row')
        .map((row) => row.textContent)
        .filter(defined)
        .sort()
    )
  ).toBeTruthy();

  await userEvent.click(screen.getByRole('select-multiple'));
  expect(screen.queryAllByRole('selected-row-id')).toHaveLength(3);
  expect(screen.getByRole('has-selected-rows')).toHaveTextContent('true');
  expect(screen.getByRole('all-selected')).toHaveTextContent('false');
  expect(screen.queryAllByRole('selected-row')).toHaveLength(3);
  expect(screen.queryAllByRole('deselected-row')).toHaveLength(3);
  expect(
    equals(
      screen
        .queryAllByRole('selected-row-id')
        .map((row) => row.textContent)
        .filter(defined)
        .sort(),
      screen
        .queryAllByRole('selected-row')
        .map((row) => row.textContent)
        .filter(defined)
        .sort()
    )
  ).toBeTruthy();

  await userEvent.click(screen.getByRole('deselect'));
  expect(screen.queryAllByRole('selected-row-id')).toHaveLength(2);
  expect(screen.getByRole('has-selected-rows')).toHaveTextContent('true');
  expect(screen.getByRole('all-selected')).toHaveTextContent('false');
  expect(screen.queryAllByRole('selected-row')).toHaveLength(2);
  expect(screen.queryAllByRole('deselected-row')).toHaveLength(4);
  expect(
    equals(
      screen
        .queryAllByRole('selected-row-id')
        .map((row) => row.textContent)
        .filter(defined)
        .sort(),
      screen
        .queryAllByRole('selected-row')
        .map((row) => row.textContent)
        .filter(defined)
        .sort()
    )
  ).toBeTruthy();

  await userEvent.click(screen.getByRole('deselect-multiple'));
  expect(screen.queryAllByRole('selected-row-id')).toHaveLength(0);
  expect(screen.getByRole('has-selected-rows')).toHaveTextContent('false');
  expect(screen.getByRole('all-selected')).toHaveTextContent('false');
  expect(screen.queryAllByRole('selected-row')).toHaveLength(0);
  expect(screen.queryAllByRole('deselected-row')).toHaveLength(6);

  await userEvent.click(screen.getByRole('select-all'));
  expect(screen.queryAllByRole('selected-row-id')).toHaveLength(6);
  expect(screen.getByRole('has-selected-rows')).toHaveTextContent('true');
  expect(screen.getByRole('all-selected')).toHaveTextContent('true');
  expect(screen.queryAllByRole('selected-row')).toHaveLength(6);
  expect(screen.queryAllByRole('deselected-row')).toHaveLength(0);
  expect(
    equals(
      screen
        .queryAllByRole('selected-row-id')
        .map((row) => row.textContent)
        .filter(defined)
        .sort(),
      screen
        .queryAllByRole('selected-row')
        .map((row) => row.textContent)
        .filter(defined)
        .sort()
    )
  ).toBeTruthy();

  await userEvent.click(screen.getByRole('deselect-all'));
  expect(screen.queryAllByRole('selected-row-id')).toHaveLength(0);
  expect(screen.getByRole('has-selected-rows')).toHaveTextContent('false');
  expect(screen.getByRole('all-selected')).toHaveTextContent('false');
  expect(screen.queryAllByRole('selected-row')).toHaveLength(0);
  expect(screen.queryAllByRole('deselected-row')).toHaveLength(6);
});
