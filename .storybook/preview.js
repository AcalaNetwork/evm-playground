import { addDecorator } from '@storybook/react';

import React from 'react';
import { ThemeProvider } from '@chakra-ui/system';
import { theme } from '../src/theme';

addDecorator((storyFn) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>);
