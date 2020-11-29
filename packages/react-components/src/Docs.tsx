// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-components/types';

import React from 'react';
import styled from 'styled-components';
import Markdown from 'react-markdown';

import { ELEV_2_CSS, ELEV_3_CSS } from './styles/constants';
import { useTranslation } from './translate';

export interface Props extends BareProps {
  docs?: string[];
  signature: React.ReactNode;
}

function Docs ({ className, docs, signature }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className='header'>
        {signature}
      </div>
      <div className='body'>
        {
          docs && docs.length > 0
            ? (
              <Markdown>
                {docs.join('\n')}
              </Markdown>
            )
            : (
              <i>{t('No documentation provided')}</i>
            )
        }
      </div>
    </div>
  );
}

export default React.memo(styled(Docs)`
  ${ELEV_2_CSS}
  box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 3px 6px, rgba(15, 15, 15, 0.4) 0px 9px 24px;
  z-index: 1000;

  .header {
    ${ELEV_3_CSS}
    padding: 0.5rem 1rem;
  }

  .body {
    color: var(--grey70);
    padding: 0.5rem 1rem;

    p > code {
      color: var(--blue-primary);
    }

    pre {
      padding: 1rem;
      background-color: var(--grey10);
      overflow-x: auto;
    }

    h1 {
      font-size: 14px;
      font-weight: bold;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
  }
`);
