import { useRouter } from 'next/router';
import { Timestamp } from './theme-components/timestamp';
import { FooterText } from './theme-components/footer-text';
import { Logo } from './theme-components/logo';
import { Head } from './theme-components/head';

export default {
  head: Head,
  logo: <Logo />,
  logoLink: '/',
  project: {
    link: 'https://github.com/Trautmann-Software/react-headless-table'
    // If icon is missing, it will be a GitHub icon(opens in a new tab) by default.
    /*icon: ( // Gitlab Icon
      <svg width="24" height="24" viewBox="0 0 256 256">
        <path fill="currentColor"
              d="m231.9 169.8l-94.8 65.6a15.7 15.7 0 0 1-18.2 0l-94.8-65.6a16.1 16.1 0 0 1-6.4-17.3L45 50a12 12 0 0 1 22.9-1.1L88.5 104h79l20.6-55.1A12 12 0 0 1 211 50l27.3 102.5a16.1 16.1 0 0 1-6.4 17.3Z"></path>
      </svg>
    )*/
  },
  chat: {
    link: 'https://www.npmjs.com/package/@trautmann/react-headless-table',
    // If icon is missing, it will be a Discord icon by default.
    icon: (
      <svg width="24" height="24" viewBox="0 0 27.23 27.23">
        <rect fill="#333333" width="27.23" height="27.23" rx="2"></rect>
        <polygon fill="#fff" points="5.8 21.75 13.66 21.75 13.67 9.98 17.59 9.98 17.58 21.76 21.51 21.76 21.52 6.06 5.82 6.04 5.8 21.75"></polygon>
      </svg>
    )
  },
  /*banner: {
    dismissible: true,
    key: '1.0.0-release',
    text: (
      <a href="/docs">
        🎉 React Headless Table version 1.0.0 is released. Read more →
      </a>
    )
  },*/
  navigation: true,
  sidebar: {
    defaultMenuCollapseLevel: 2
  },
  footer: {
    text: <FooterText />
  },
  gitTimestamp: Timestamp,
  // Set the repository URL of the documentation. It’s used to generate the “Edit this page” link and the “Feedback” link.
  // If the documentation is inside a monorepo, a subfolder, or a different branch of the repository, you can simply set the docsRepositoryBase to the root path of the pages/ folder of your docs. For example:
  docsRepositoryBase: 'https://github.com/Trautmann-Software/react-headless-table/blob/HEAD/docs',
  useNextSeoProps() {
    const { route } = useRouter();
    if (route !== '/') {
      return ({
        titleTemplate: '%s – React Headless Table'
      });
    }
  },
  darkMode: true
};