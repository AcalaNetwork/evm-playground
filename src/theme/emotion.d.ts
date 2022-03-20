import '@emotion/react/macro';
import { CustomTheme } from './theme';

declare module '@emotion/react/macro' {
  export interface Theme extends CustomTheme {}
}
