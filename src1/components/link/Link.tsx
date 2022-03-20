import { Link as CLink, LinkProps as CLinkProps } from '@chakra-ui/layout';
import { forwardRef } from '@chakra-ui/system';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

export type LinkProps = Omit<CLinkProps, 'href'> &
  NextLinkProps & {
    variant?: 'icon' | string;
    disabled?: boolean;
    isExternal?: boolean;
  };

export const Link = styled(
  forwardRef<LinkProps, 'a'>((props, ref) => {
    const {
      as,
      disabled,
      href,
      isExternal,
      locale,
      passHref = true,
      prefetch,
      replace,
      scroll,
      shallow,
      variant,
      ...rest
    } = props;

    return (
      <NextLink
        as={as}
        href={href}
        locale={locale}
        passHref={passHref}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
      >
        <CLink
          css={css`
            color: inherit;
            text-decoration: none;

            &:hover {
              text-decoration: none;
            }
            &:focus {
              box-shadow: none;
            }

            ${variant === 'icon' &&
            css`
              line-height: 0;
            `}
          `}
          ref={ref}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          target={isExternal ? '_blank' : undefined}
          {...rest}
        />
      </NextLink>
    );
  })
)``;

Link.displayName = 'Link';
