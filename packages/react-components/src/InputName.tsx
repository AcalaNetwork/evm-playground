// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-components/types';
import { VoidFn } from '@canvas-ui/react-util/types';

import React from 'react';
import Input from './Input';

import { useTranslation } from './translate';

interface Props extends BareProps {
  isBusy?: boolean;
  isContract?: boolean;
  isError?: boolean;
  isDisabled?: boolean;
  onChange: (_: string) => void;
  onEnter?: VoidFn;
  placeholder?: string;
  value?: string;
}

function InputName ({ className, isBusy, isContract, isError, onChange, onEnter, value = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Input
      className={className}
      help={t(
        isContract
          ? 'A name for the deployed contract to help users distinguish. Only used for display purposes.'
          : 'A name for this WASM code to help users distinguish. Only used for display purposes.'
      )}
      isDisabled={isBusy}
      isError={isError}
      label={t(
        isContract
          ? 'Contract Name'
          : 'Code Bundle Name'
      )}
      onChange={onChange}
      onEnter={onEnter}
      placeholder={t(
        isContract
          ? 'Give your contract a descriptive name'
          : 'Give your code bundle a descriptive name'
      )}
      value={value}
    />
  );
}

export default React.memo(InputName);
