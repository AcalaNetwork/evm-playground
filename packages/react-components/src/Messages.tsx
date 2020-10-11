// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-components/types';
import { AbiMessage } from '@canvas-ui/api-contract/types';

import React from 'react';
import styled from 'styled-components';
import { Abi } from '@canvas-ui/api-contract';
import { classes } from '@canvas-ui/react-util';

import { ELEV_3_CSS } from './styles/constants';
import Button from './Button';
import Expander from './Expander';
import MessageSignature from './MessageSignature';
import { useTranslation } from './translate';

export interface Props extends BareProps {
  abi: Abi;
  address?: string;
  isLabelled?: boolean;
  isRemovable: boolean;
  onRemove?: () => void;
  onSelect?: (messageIndex: number) => () => void;
  onSelectConstructor?: (constructorIndex: number) => void;
  withConstructors?: boolean;
}

// const NOOP = (): void => undefined;

function onSelect (props: Props, messageIndex: number): () => void {
  return function (): void {
    const { abi: { messages }, address: callAddress, onSelect } = props;

    if (!callAddress || !messages || !messages[messageIndex]) {
      return;
    }

    onSelect && onSelect(messageIndex)();
  };
}

function onSelectConstructor (props: Props, index: number): () => void {
  return function (): void {
    const { abi: { constructors }, onSelectConstructor } = props;

    if (!constructors || !constructors[index]) {
      return;
    }

    onSelectConstructor && onSelectConstructor(index);
  };
}

function renderItem (props: Props, message: AbiMessage, index: number, asConstructor: boolean, t: <T = string> (key: string) => T): React.ReactNode {
  const { docs = [], identifier } = message;

  return (
    <div
      className={classes('message', !onSelect && 'exempt-hover', asConstructor && 'asConstructor')}
      key={identifier}
    >
      <div className='info'>
        <MessageSignature
          asConstructor={asConstructor}
          message={message}
          withTooltip
        />
        <Expander
          className='docs'
          summary={
            docs && docs.length > 0
              ? docs
                .filter((line) => line !== '')
                .map((line, index) => ((
                  <React.Fragment key={`${identifier.toString()}-docs-${index}`}>
                    <span>{line.toString()}</span>
                    <br />
                  </React.Fragment>
                )))
              : (
                <i>{t<string>('No documentation provided')}</i>
              )
          }
        />
      </div>
      {!asConstructor && props.onSelect && (
        <div className='accessory'>
          <Button
            className='execute'
            icon='play'
            onClick={onSelect(props, index)}
            tooltip={t<string>('Call this message')}
          />
        </div>
      )}
      {asConstructor && props.onSelectConstructor && (
        <div className='accessory'>
          <Button
            className='execute'
            icon='cloud upload'
            onClick={onSelectConstructor(props, index)}
            tooltip={t<string>('Deploy with this constructor')}
          />
        </div>
      )}
    </div>
  );
}

function renderConstructor (props: Props, index: number, t: <T = string> (key: string) => T): React.ReactNode {
  const { abi: { constructors } } = props;

  if (!constructors[index]) {
    return null;
  }

  return renderItem(props, constructors[index], index, true, t);
}

function renderMessage (props: Props, index: number, t: <T = string> (key: string) => T): React.ReactNode {
  const { abi: { messages } } = props;

  if (!messages[index]) {
    return null;
  }

  return renderItem(props, messages[index], index, false, t);
}

function Messages (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { abi: { constructors, messages }, className = '', isLabelled, /* isRemovable, onRemove = NOOP, */ withConstructors } = props;

  return (
    <div className={classes(className, 'ui--Messages', isLabelled && 'labelled')}>
      {withConstructors && constructors.map((_, index): React.ReactNode => renderConstructor(props, index, t))}
      {messages.map((_, index): React.ReactNode => renderMessage(props, index, t))}
      {/* isRemovable && (
        <IconLink
          className='remove-abi'
          icon='remove'
          label={t<string>('Remove ABI')}
          onClick={onRemove}
        />
      ) */}
    </div>
  );
}

export default React.memo(styled(Messages)`
  .remove-abi {
    float: right;

    &:hover, &:hover :not(i) {
      text-decoration: underline;
    }
  }

  & .message {
    ${ELEV_3_CSS}
    display: inline-flex;
    padding: 0.5rem 1rem;
    transition: all 0.2s;
    width: 100%;

    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }

    &.constructor {
    }

    &.disabled {
      opacity: 1 !important;
      background: #eee !important;
      color: #555 !important;
    }

    .accessory {
      width: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .execute {
        display: none;
        background: transparent !important;
        font-size: 1.5rem;
        margin: 0;
        padding: 0;
      }
    }

    &:hover {
      .accessory .execute {
        display: block;
        color: rgba(0, 0, 0, 0.2);

        &:hover {
          color: #2e86ab;
        }
      }
    }

    .info {
      flex: 1 1;

      .docs {
        font-size: 0.8rem;
        font-weight: normal;
      }
    }
  }
`);
