import { Fragment, FunctionComponent } from 'react';
import docgenData from '../.docgen/docgen.json';
import { Code, Text } from '@mantine/core';
import { CustomColumn, MantineTable } from './mantine-table';
import { Column } from '@trautmann/react-headless-table/dist/src';

type RowData = {
  name?: string;
  required?: boolean;
  type?: {
    name?: string;
  };
  description?: string;
  defaultValue?: {
    value?: string;
  };
};

const columns: Array<Column<RowData, CustomColumn<RowData>>> = [
  {
    field: 'name',
    type: 'string',
    title: 'Name',
    render: (row) => (
      <Fragment>
        <Code>{row.data?.name}</Code>
        {row.data?.required && (
          <Text fz="xs" fw={500}>
            required
          </Text>
        )}
      </Fragment>
    ),
  },
  {
    field: 'type.name',
    type: 'string',
    value: (row) => row.data.type?.name,
    title: 'Type',
    render: (row) => <Code>{row.data.type?.name}</Code>,
  },
  {
    field: 'description',
    type: 'string',
    value: (row) => row.data.description,
    title: 'Description',
    render: (row) => (
      <Fragment>
        {row.data?.description && <Text fz="md">{row.data.description}</Text>}
        {row.data?.defaultValue?.value && <Code>@default {row.data.defaultValue.value}</Code>}
      </Fragment>
    ),
  },
];

type Props = {
  of: FunctionComponent;
};

export function PropsTable({ of }: Props) {
  if (!of.name || !docgenData.some((entry) => entry.displayName === of.name)) {
    return <Fragment />;
  }

  const componentProps = docgenData.find((entry) => entry.displayName === of.name)?.props;
  const rows = Object.values(componentProps ?? {});

  return <MantineTable columns={columns} rows={rows} />;
}
