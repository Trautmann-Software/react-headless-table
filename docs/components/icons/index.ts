import { SVGProps } from 'react';

export type IconProps = Pick<SVGProps<SVGSVGElement>, 'width' | 'height'>;

export * from './npm-icon';
export * from './yarn-icon';
export * from './js-icon';
export * from './ts-icon';
