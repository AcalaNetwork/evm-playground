// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IconProps } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import { BareProps } from './types';

import React, { useCallback, useContext } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import StatusContext from './Status/Context';
import Button from './Button';
import { useTranslation } from './translate';
import styled from 'styled-components';

interface Props extends BareProps {
  children?: React.ReactNode;
  className?: string;
  icon?: string;
  isAddress?: boolean;
  size?: IconProps['size'];
  value: string;
}

function CopyButton ({ children, className, icon = 'copy outline', isAddress = false, size = 'small', value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { queueAction } = useContext(StatusContext);

  const _onCopy = useCallback(
    (): void => {
      isAddress && queueAction && queueAction({
        account: value,
        action: t<string>('clipboard'),
        message: t<string>('address copied'),
        status: 'queued'
      });
    },
    [isAddress, queueAction, t, value]
  );

  return (
    <div className={className}>
      <CopyToClipboard
        onCopy={_onCopy}
        text={value}
      >
        <div className='copyContainer'>
          {children}
          <span className='copySpan'>
            <Button
              className='icon-button show-on-hover'
              icon={icon}
              isIcon
              isPrimary
              size={size}
            />
          </span>
        </div>
      </CopyToClipboard>
    </div>
  );
}

export default React.memo(styled(CopyButton)`
  cursor: copy;
  display: inline-block;

  button.ui.icon.primary.button.icon-button {
    cursor: copy;
    position: relative;
    top: 2px;
  }

  .copySpan {
    white-space: nowrap;
  }
`);
