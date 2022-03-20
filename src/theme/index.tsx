import { ChakraProvider } from '@chakra-ui/react';
import createCache from '@emotion/cache';
import { CacheProvider, Global, ThemeProvider as StyledThemeProvider } from '@emotion/react/macro';
import { globalCSS } from './globalCss';
import { theme } from './theme';

const myCache = createCache({
  key: 'adao',
  ...(process.env.NODE_ENV === 'development' && { stylisPlugins: [] })
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={myCache}>
      <ChakraProvider resetCSS={false}>
        <StyledThemeProvider theme={theme}>
          <Global styles={globalCSS} />
          {children}
        </StyledThemeProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
