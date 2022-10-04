import React from 'react';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import createEmotionCache from '../utility/createEmotionCache';
import darkTheme from '../styles/theme/darkTheme';
import '../styles/globals.css';
import { RecoilRoot } from 'recoil';
import NavBar from '../components/muiComponents/NavBar';
import { SessionProvider } from 'next-auth/react';

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <RecoilRoot>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <SessionProvider session={pageProps.session}>
            <NavBar />
            <Component {...pageProps} />
          </SessionProvider>
        </ThemeProvider>
      </CacheProvider>
    </RecoilRoot>
  );
};

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
