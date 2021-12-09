import styled from '@emotion/styled';
import React from 'react';
import { Box, BoxProps } from '../../components';
import { Header } from '../header';

export const PageWrapper = styled(Box)``;

export const LayoutWrapper = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
