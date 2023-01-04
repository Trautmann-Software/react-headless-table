import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';
import { Timestamp } from './theme-components/timestamp';

export default {
  head: () => {
    const { asPath } = useRouter();
    const { frontMatter } = useConfig();
    return (
      <>
        <meta property="og:url" content={`https://my-app.com${asPath}`} />
        <meta property="og:title" content={frontMatter.title || 'Nextra'} />
        <meta property="og:description" content={frontMatter.description || 'My Nextra Documentation'} />
      </>
    );
  },
  logo: <span>My Nextra Documentation</span>,
  logoLink: '/',
  project: {
    link: 'https://github.com/shuding/nextra',
    // If icon is missing, it will be a GitHub icon(opens in a new tab) by default.
    /*icon: ( // Gitlab Icon
      <svg width="24" height="24" viewBox="0 0 256 256">
        <path fill="currentColor"
              d="m231.9 169.8l-94.8 65.6a15.7 15.7 0 0 1-18.2 0l-94.8-65.6a16.1 16.1 0 0 1-6.4-17.3L45 50a12 12 0 0 1 22.9-1.1L88.5 104h79l20.6-55.1A12 12 0 0 1 211 50l27.3 102.5a16.1 16.1 0 0 1-6.4 17.3Z"></path>
      </svg>
    )*/
  },
  chat: {
    link: 'https://twitter.com/shuding_'
    // If icon is missing, it will be a Discord icon by default.
    /*icon: <svg width="24" height="24" viewBox="0 0 256 256">
      <path fill="currentColor"
            d="m231.9 169.8l-94.8 65.6a15.7 15.7 0 0 1-18.2 0l-94.8-65.6a16.1 16.1 0 0 1-6.4-17.3L45 50a12 12 0 0 1 22.9-1.1L88.5 104h79l20.6-55.1A12 12 0 0 1 211 50l27.3 102.5a16.1 16.1 0 0 1-6.4 17.3Z"></path>
    </svg>*/
  },
  banner: {
    dismissible: true,
    key: '2.0-release',
    text: <a href="https://nextra.site" target="_blank">
      🎉 Nextra 2.0 is released. Read more →
    </a>
  },
  sidebar: {
    defaultMenuCollapseLevel: 0
  },
  toc: {
    // Table of contents
    extraContent: <span>Extra content</span>
  },
  footer: {
    text: (
      <>
        {`${new Date().getFullYear()}${String.fromCodePoint(160, 169, 160)}`}<a href="https://trautmann.software"
                                                                                target="_blank">Trautmann Software</a>.
      </>
    )
  },
  gitTimestamp: Timestamp,
  // Set the repository URL of the documentation. It’s used to generate the “Edit this page” link and the “Feedback” link.
  // If the documentation is inside a monorepo, a subfolder, or a different branch of the repository, you can simply set the docsRepositoryBase to the root path of the pages/ folder of your docs. For example:
  docsRepositoryBase: 'https://github.com/shuding/nextra/blob/core/docs/pages',
  useNextSeoProps() {
    const { route } = useRouter();
    if (route !== '/') {
      return ({
        titleTemplate: '%s – SWR'
      });
    }
  },
  darkMode: true
  // ...
};