import { ThemeProvider } from '@chakra-ui/system';
import { Global } from '@emotion/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import { Provider } from 'react-redux';
import { Api } from '../chain-api';
import store from '../state';
import { Updater as GlobalUpdater } from '../state/global/updater';
import { globalCSS, theme, presetCSS } from '../theme';
import { LayoutWrapper } from '../views';
import { ENDPOINTS, TITLE } from '../config';

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <Fragment>
      <Head>
        <title>{TITLE}</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Global styles={globalCSS} />
          <Global styles={presetCSS} />
          <Api endpoints={ENDPOINTS}>
            <LayoutWrapper>
              <GlobalUpdater />
              <Component {...pageProps} />
            </LayoutWrapper>
          </Api>
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
}

export default appWithTranslation(App);
