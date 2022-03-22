import { ChakraProvider } from '@chakra-ui/react';
import createCache from '@emotion/cache';
import { css, useTheme, CacheProvider, Global, ThemeProvider as StyledThemeProvider } from '@emotion/react/macro';
import { globalCSS, presetCSS } from './css';
import { theme } from './theme';

const myCache = createCache({
  key: 'adao',
  ...(process.env.NODE_ENV === 'development' && { stylisPlugins: [] })
});

const GlobalBody = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        body {
          color: ${theme.colors.font.body};
          background-color: ${theme.colors.body};
          line-height: ${theme.lineHeights.normal};
        }
      `}
    />
  );
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={myCache}>
      <ChakraProvider resetCSS={false}>
        <StyledThemeProvider theme={theme}>
          <Global styles={globalCSS} />
          <Global styles={presetCSS} />
          <GlobalBody />
          {children}
        </StyledThemeProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
