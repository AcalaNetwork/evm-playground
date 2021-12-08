import styled from '@emotion/styled';
import React from 'react';
import { Box, BoxProps } from '../../components';

export const PageWrapper = styled(Box)``;

export const LayoutWrapper = ({ children }: React.PropsWithChildren<{}>) => {
  return <>{children}</>;
};
