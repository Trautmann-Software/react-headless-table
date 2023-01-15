# React Headless Table

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Stars][stars-image]][stars-url]
[![Last commit][last-commit-image]][repo-url]
[![Closed issues][closed-issues-image]][closed-issues-url]
[![Downloads][downloads-image]][npm-url]
[![Language][language-image]][repo-url]

A headless table implementation that saves state in react context, allows state access and manipulations via hooks. Provides functionalities like searching, filtering, sorting and pagination.

> This library is under active development! Please check back a little later.

## Full documentation and examples

Visit [react-headless-table.trautmann.software](https://react-headless-table.trautmann.software) to view the full documentation and learn how to use it by browsing a comprehensive list of examples.

## Quickstart

Install the package and its dependencies:

```sh
npm i uuid @trautmann/react-headless-table
```

Use it in your code:

1. Wrap you table component into `ReactHeadlessTable` and provide it with necessary data

```js
// table.js
import { ReactHeadlessTable } from '@trautmann/react-headless-table';
import { TableHead } from './table-head';
import { TableBody } from './table-body';

export function Table(props) {
  const { columns, rows } = props;
  return (
    <ReactHeadlessTable columns={columns} rows={rows}>
      <table>
        <TableHead />
        <TableBody />
      </table>
    </ReactHeadlessTable>
  );
}
```

2. Access data and functionality via hooks in child components

```js
// table-head.js
import { useColumns } from '@trautmann/react-headless-table';

export function TableHead() {
  const { columns } = useColumns();
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <td key={column.id}>{column.field}</td>
        ))}
      </tr>
    </thead>
  );
}
```

```js
// table-body.js
import { useColumns, useRows } from '@trautmann/react-headless-table';

export function TableHead() {
  const { columns } = useColumns();
  const { rows } = useRows();
  return (
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          {columns.map((column) => (
            <td key={column.id}>{row.data?.[column.field] ?? ''}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
```

Have a look at the available [component properties](https://react-headless-table.trautmann.software/docs/component-properties) and make sure to browse the comprehensive list of [usage examples](https://react-headless-table.trautmann.software/examples/basic-usage).

## Code contributors

[![Contributors list](https://contrib.rocks/image?repo=Trautmann-Software/react-headless-table)](https://github.com/Trautmann-Software/react-headless-table/graphs/contributors)

Want to [become a code contributor](https://react-headless-table.trautmann.software/contribute-and-support)?

## Sponsor the project

If you find this package useful, please consider ❤️[sponsoring my work](https://github.com/sponsors/Trautmann-Software). Your sponsorship will help me dedicate more time to maintaining the project and will encourage me to add new features and fix existing bugs.

## Other means of support

If you find this package useful, please 🙏star the repository, 💕[tweet about it](http://twitter.com/share?text=Build%20data-rich%20React%20applications%20with%20%40trautmann%2Freact-headless-table&url=https%3A%2F%2Freact-headless-table.trautmann.software&hashtags=react%2Cdatatable%2Cheadless%2Chooks&via=trautmann_soft), 👍[endorse me on LinkedIn](https://www.linkedin.com/in/rashad2985) or consider hiring my services.

The more stars this repository gets, the more visibility it gains among the developers and users community. The more
users it gets, the more chances that some of those users will become active code contributors willing to put
their effort into bringing new features to life and/or fixing bugs.

As the repository gain awareness, my chances of getting motivated to work on Mantine-based projects will increase,
which in turn will help maintain my vested interest in keeping the project alive.

## License

The [MIT License](https://github.com/Trautmann-Software/react-headless-table/blob/main/LICENSE).

[npm-url]: https://www.npmjs.com/package/@trautmann/react-headless-table
[repo-url]: https://github.com/Trautmann-Software/react-headless-table
[stars-url]: https://github.com/Trautmann-Software/react-headless-table/stargazers
[closed-issues-url]: https://github.com/Trautmann-Software/react-headless-table/issues?q=is%3Aissue+is%3Aclosed
[license-url]: LICENSE
[npm-image]: https://img.shields.io/npm/v/@trautmann/react-headless-table.svg?style=flat-square
[license-image]: http://img.shields.io/npm/l/@trautmann/react-headless-table.svg?style=flat-square
[downloads-image]: http://img.shields.io/npm/dm/@trautmann/react-headless-table.svg?style=flat-square
[stars-image]: https://img.shields.io/github/stars/Trautmann-Software/react-headless-table?style=flat-square
[last-commit-image]: https://img.shields.io/github/last-commit/Trautmann-Software/react-headless-table?style=flat-square
[closed-issues-image]: https://img.shields.io/github/issues-closed-raw/Trautmann-Software/react-headless-table?style=flat-square
[language-image]: https://img.shields.io/github/languages/top/Trautmann-Software/react-headless-table?style=flat-square
