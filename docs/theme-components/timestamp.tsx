import { FC, Fragment } from 'react';
import * as process from 'process';

export const Timestamp: FC<{ timestamp: Date }> = ({ timestamp }) => (
  <Fragment>
    <div>Version {process.env.PACKAGE_VERSION}</div>
    <div>Last updated on {timestamp.toLocaleDateString()}</div>
  </Fragment>
);
