import { MantineProvider } from '@mantine/core';
import { PropsWithChildren } from 'react';
import { useTheme } from 'nextra-theme-docs';

export function Mantine({ children }: PropsWithChildren) {
  const { resolvedTheme } = useTheme();
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: resolvedTheme === 'light' ? 'light' : 'dark' }}
    >
      {children}
    </MantineProvider>
  );
}
