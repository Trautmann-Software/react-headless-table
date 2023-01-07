import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { TestComponentProvider } from './test-component-provider';
import { CustomFilter } from './test-data';
import { useFilters } from '../src/hooks/use-filters';

function TestComponent() {
  const { filters, addFilter, updateFilter, removeFilter } = useFilters<CustomFilter>();

  return (
    <>
      <ul>
        {filters.map((filter) => (
          <li key={filter.id} role="filters" data-testid={`filter-${filter.id}`}>
            <span role={filter.customFilterField}>{filter.customFilterField}</span>
            <span role={filter.customOptionalFilterField}>{filter.customOptionalFilterField}</span>
          </li>
        ))}
      </ul>

      <button role="add-filter" onClick={() => addFilter({
        id: 'added',
        chainAs: 'OR',
        columnId: 'column-add',
        operator: () => true,
        customFilterField: 'custom-field',
        customOptionalFilterField: 'optional-field'
      })}>
        add-filter
      </button>
      <button role="update-filter" onClick={() => updateFilter({
        id: 'added',
        chainAs: 'AND',
        columnId: 'column-add',
        operator: () => true,
        customFilterField: 'updated-custom-field',
        customOptionalFilterField: 'updated-optional-field'
      })}>
        update-filter
      </button>
      <button role="remove-filter" onClick={() => removeFilter('added')}>
        remove-filter
      </button>
    </>
  );
}

test('useColumns hook delivers correct columns', async () => {
  render(
    <TestComponentProvider<{}, {}, {}, CustomFilter> filters={[
      { operator: () => true, customFilterField: 'custom-field' },
      { operator: () => true, customFilterField: 'custom-field', customOptionalFilterField: 'optional-field' },
      { operator: () => true, customFilterField: 'custom-field' }
    ]}>
      <TestComponent />
    </TestComponentProvider>
  );

  expect(screen.getAllByRole('filters')).toHaveLength(3);
  expect(screen.queryByTestId('filter-added')).not.toBeInTheDocument();

  // Add a new filter
  await userEvent.click(screen.getByRole('add-filter'));
  expect(screen.getAllByRole('filters')).toHaveLength(4);
  expect(screen.queryByTestId('filter-added')).toBeInTheDocument();
  expect(screen.queryAllByRole('custom-field')).toHaveLength(4);
  expect(screen.queryAllByRole('optional-field')).toHaveLength(2);

  // Update added filter
  await userEvent.click(screen.getByRole('update-filter'));
  expect(screen.getAllByRole('filters')).toHaveLength(4);
  expect(screen.queryByTestId('filter-added')).toBeInTheDocument();
  expect(screen.queryAllByRole('custom-field')).toHaveLength(3);
  expect(screen.queryAllByRole('updated-custom-field')).toHaveLength(1);
  expect(screen.queryAllByRole('optional-field')).toHaveLength(1);
  expect(screen.queryAllByRole('updated-optional-field')).toHaveLength(1);

  // Remove added filter
  await userEvent.click(screen.getByRole('remove-filter'));
  expect(screen.getAllByRole('filters')).toHaveLength(3);
  expect(screen.queryByTestId('filter-added')).not.toBeInTheDocument();
  expect(screen.queryAllByRole('custom-field')).toHaveLength(3);
  expect(screen.queryAllByRole('updated-custom-field')).toHaveLength(0);
  expect(screen.queryAllByRole('optional-field')).toHaveLength(1);
  expect(screen.queryAllByRole('updated-optional-field')).toHaveLength(0);
});
