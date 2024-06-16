import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';
import { Fragment } from 'react';

export function Head() {
  const { asPath } = useRouter();
  const { frontMatter } = useConfig();
  return (
    <Fragment>
      <meta property="og:url" content={`https://react-headless-table.trautmann.software${asPath}`} />
      <meta property="og:title" content={frontMatter.title || 'React Headless Table'} />
      <meta property="og:description" content={frontMatter.description || 'React Headless Table Documentation'} />
    </Fragment>
  );
}
