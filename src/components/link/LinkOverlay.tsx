import { forwardRef } from '@chakra-ui/system';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { Link, LinkProps } from './Link';

export const LinkOverlay = styled(
  forwardRef<LinkProps, 'a'>(({ href, ...rest }, ref) => {
    return (
      <Link
        css={css`
          position: static;
          &::before: {
            content: '';
            cursor: inherit;
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
            width: 100%;
            height: 100%;
          }
        `}
        href={href}
        ref={ref}
        {...rest}
      />
    );
  })
)``;

LinkOverlay.displayName = 'LinkOverlay';
