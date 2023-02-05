import { memo } from 'react';
import { IconProps } from './index';

export const NpmIcon = memo(({width = 16, height = 16}: IconProps) => (
  <svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" width={width} height={height} focusable="false">
    <path d="M0 256V0h256v256z" fill="#C12127"></path>
    <path d="M48 48h160v160h-32V80h-48v128H48z" fill="#FFF"></path>
  </svg>
));