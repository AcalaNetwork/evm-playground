import { ThemeContext } from '@emotion/react';
import { useContext } from 'react';

export type WithCSSVar<T> = T & {
  __cssVars: Record<string, any>;
  __cssMap: Record<
  string,
  {
    value: string;
    var: string;
    varRef: string;
  }
  >;
};

export function useTheme<T extends object = Record<string, any>> () {
  const theme = useContext((ThemeContext as unknown) as React.Context<T | undefined>);

  if (!theme) {
    throw Error(
      'useTheme: `theme` is undefined. Seems you forgot to wrap your app in `<ChakraProvider />` or `<ThemeProvider />`'
    );
  }

  return theme as WithCSSVar<T>;
}
