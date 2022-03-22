import { Link as CLink, LinkProps as CLinkProps } from '@chakra-ui/layout';
import { forwardRef } from '@chakra-ui/system';
import { css } from '@emotion/react/macro';
import styled from '@emotion/styled/macro';
import React, { useMemo } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export type LinkProps = Omit<CLinkProps, 'href'> &
  RouterLinkProps & {
    disabled?: boolean;
    isExternal?: boolean;
  };

const isValidUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};

export const Link = React.memo(
  styled(
    forwardRef<LinkProps, 'a'>((props, ref) => {
      const { to: _to, href: _href, variant, isExternal, ...rest } = props;

      const isUrl = useMemo(() => {
        if (typeof _to !== 'string') return false;
        return isValidUrl(_to);
      }, [_to]);

      const as = isUrl ? 'a' : RouterLink;
      const to = isUrl ? undefined : _to;
      const href = isUrl && typeof _to === 'string' ? _to : undefined;

      return (
        <CLink
          as={as}
          href={href}
          to={to}
          css={css`
            color: #4361ee;
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
      );
    })
  )``
);

Link.displayName = 'Link';
