import { Mantine } from './mantine';
import { Stack, Table, TextInput } from '@mantine/core';
import { ReactNode } from 'react';
import {
  ReactHeadlessTable,
  ReactHeadlessTableProps,
  Row,
  useColumns,
  useRows,
  useSearchQuery,
} from '@trautmann/react-headless-table';
import { IconSearch } from '@tabler/icons-react';

export type CustomColumn<RowData extends Record<string, any> = {}> = {
  title: string;
  render?: (row: Row<RowData>) => ReactNode;
};

type Props<RowData extends Record<string, any> = {}> = Omit<
  ReactHeadlessTableProps<RowData, CustomColumn<RowData>>,
  'children'
> & {
  caption?: ReactNode;
};

export function MantineTable<RowData extends Record<string, any> = {}>({ caption, ...props }: Props<RowData>) {
  return (
    <ReactHeadlessTable {...props}>
      <Mantine>
        <MantineTableInner caption={caption} />
      </Mantine>
    </ReactHeadlessTable>
  );
}

type InnerProps<RowData extends Record<string, any> = {}> = Pick<Props<RowData>, 'caption'>;
function MantineTableInner<RowData extends Record<string, any> = {}>({ caption }: InnerProps) {
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const { columns } = useColumns<RowData, CustomColumn<RowData>>();
  const { rows } = useRows<RowData>();

  return (
    <Stack sx={{ marginTop: 8, marginBottom: 8 }}>
      <TextInput
        type="search"
        placeholder="Search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        icon={<IconSearch size={14} />}
      />
      <Table striped withBorder captionSide="bottom">
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
        {caption && <caption style={{ textAlign: 'left' }}>{caption}</caption>}
      </Table>
    </Stack>
  );
}
