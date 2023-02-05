import { Fragment } from 'react';

export function FooterText() {
  return (
    <Fragment>
      {`${new Date().getFullYear()}${String.fromCodePoint(160, 169, 160)}`}
      <a href="https://trautmann.software" target="_blank">
        Trautmann Software
      </a>
    </Fragment>
  );
}
