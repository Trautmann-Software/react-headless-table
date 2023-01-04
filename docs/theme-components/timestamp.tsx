import { FC } from 'react';

export const Timestamp: FC<{ timestamp: Date }> = ({ timestamp }) => (
  <span>Last updated on {timestamp.toLocaleDateString()}</span>
);
