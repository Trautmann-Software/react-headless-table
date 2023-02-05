import { Fragment, memo, ReactElement } from 'react';

type Props = {
  label?: ReactElement;
  icon?: ReactElement;
}

export const TabItem = memo(({ icon, label }: Props) => (
  icon && label ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        columnGap: 8
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  ) : (icon || label || <Fragment />)
));