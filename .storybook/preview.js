import { addDecorator } from '@storybook/react';

import React from 'react';
import { ThemeProvider } from '@chakra-ui/system';
import { theme } from '../src/theme';

addDecorator((storyFn) => (
  <ThemeProvider theme={theme}>
    <div style={{ background: '#0e1116', height: '100%', padding: '120px 32px' }}>{storyFn()}</div>
  </ThemeProvider>
));
