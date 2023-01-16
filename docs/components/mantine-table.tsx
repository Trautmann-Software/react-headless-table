import { Mantine } from './mantine';
import { Stack, Table, TextInput } from '@mantine/core';
import { ReactNode } from 'react';
import {
  ReactHeadlessTable,
  ReactHeadlessTableProps,
  Row,
  useColumns, useRows,
  useSearchQuery
} from '@trautmann/react-headless-table';

export type CustomColumn<RowData extends Record<string, any> = {}> = {
  title: string;
  render?: (row: Row<RowData>) => ReactNode;
};

export function MantineTable<RowData extends Record<string, any> = {}>(
  props: Omit<ReactHeadlessTableProps<RowData, CustomColumn<RowData>>, 'children'>
) {
  return (
    <ReactHeadlessTable {...props}>
      <Mantine>
        <MantineTableInner />
      </Mantine>
    </ReactHeadlessTable>
  );
}

function MantineTableInner<RowData extends Record<string, any> = {}>() {
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const { columns } = useColumns<RowData, CustomColumn<RowData>>();
  const { rows } = useRows<RowData>();

  return (
    <Stack sx={{ marginTop: 8, marginBottom: 8 }}>
      <TextInput
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
      />
      <Table striped>
        <thead>
          <tr>
            {columns.map((column) => (
              <td key={column.id}>{column.title}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.id} valign="top">
                  {column.render ? column.render(row) : String(column.value(row) ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Stack>
  );
}
