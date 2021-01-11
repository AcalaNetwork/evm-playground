// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { availableExtensions } from "@canvas-ui/apps-config/extensions";
import { withMulti, withObservable } from "@canvas-ui/react-api/hoc";
import { getEvmAccounts } from "@canvas-ui/react-api/util/getEvmAccounts";
import { useApi } from "@canvas-ui/react-hooks";
import { classes, getAddressName } from "@canvas-ui/react-util";
import { StringOrNull } from "@canvas-ui/react-util/types";
import keyring from "@polkadot/ui-keyring";
import { createOptionItem } from "@polkadot/ui-keyring/options/item";
import {
  KeyringOption$Type,
  KeyringOptions,
  KeyringSectionOption,
  KeyringSectionOptions,
} from "@polkadot/ui-keyring/options/types";
import { isNull, isUndefined } from "@polkadot/util";
import { detect } from "detect-browser";
import React, { useCallback, useMemo } from "react";
import store from "store";
import styled from "styled-components";
import Dropdown from "../Dropdown";
import InputStatus from "../InputStatus";
import { useTranslation } from "../translate";
import { BareProps } from "../types";
import createHeader from "./createHeader";
import createItem from "./createItem";
import { NoAccount } from "./KeyPair";
import { Option } from "./types";

interface Props extends BareProps {
  defaultValue?: Uint8Array | string | null;
  filter?: string[];
  help?: React.ReactNode;
  hideAddress?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isInput?: boolean;
  isMultiple?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  onChange?: (value: string | null) => void;
  onChangeMulti?: (value: string[]) => void;
  options?: KeyringSectionOption[];
  optionsAll?: Record<string, Option[]>;
  placeholder?: string;
  type?: any;
  value?: string | Uint8Array | string[] | null;
  withEllipsis?: boolean;
  withLabel?: boolean;
  helpText?: string;
}

type Browser = "chrome" | "firefox";

type ExportedType = React.ComponentType<Props> & {
  createOption: (option: KeyringSectionOption, isUppercase?: boolean) => Option;
  setLastValue: (type: KeyringOption$Type, value: string) => void;
};

// interface State {
//   lastValue?: string;
//   value?: string | string[];
// }

const STORAGE_KEY = "options:InputAddress";
const DEFAULT_TYPE = "all";
const MULTI_DEFAULT: string[] = [];

const browserInfo = detect();
const browserName: Browser | null = (browserInfo && (browserInfo.name as Browser)) || null;
const isSupported = browserName && Object.keys(availableExtensions).includes(browserName);

function transformToAddress(value?: string | Uint8Array | null): string | null {
  return value as string;
}

function getEvmOptions() {
  const evmAccounts = getEvmAccounts();

  const testAccount = [
    {
      key: "0xdF3AeDF6cA6f52eF366584A29E71EfDC0BD22DA6",
      name: "evm-test-account-1",
      value: "0xdF3AeDF6cA6f52eF366584A29E71EfDC0BD22DA6",
      pk: "0x98319d4ff8a9508c4bb0cf0b5a78d760a0b2082c02775e6e82370816fedfff48",
    },
    {
      key: "0x1F7a1Bb6ccF988b07db54155B272C06FFAA2D46B",
      name: "evm-test-account-2",
      value: "0x1F7a1Bb6ccF988b07db54155B272C06FFAA2D46B",
      pk: "0x081ff694633e255136bdb456c20a5fc8fed21f8b964c11bb17ff534ce80ebd59",
    },
    {
      key: "0x7D2E6917C9c29d6D8A9819736481F9ed8fE1f30E",
      name: "evm-test-account-3",
      value: "0x7D2E6917C9c29d6D8A9819736481F9ed8fE1f30E",
      pk: "0xa8f2d83016052e5d6d77b2f6fd5d59418922a09024cda701b3c34369ec43a766",
    },
  ];

  // for (const t of testAccount) {
  //   const pair = keyring.keyring.createFromUri(t.pk, {}, "ethereum")

  //   keyring.keyring.addPair(pair);
  //   console.log(pair.address)
  // }

  if (evmAccounts && evmAccounts.length) {
    return [
      {
        key: "header-accounts",
        name: "Accounts",
        value: null,
      },
      ...evmAccounts.map((s: any) => ({
        key: s.address,
        name: s.name,
        value: s.address,
      })),
      {
        key: "header-development",
        name: "Development",
        value: null,
      },
      ...testAccount,
    ];
  }

  return testAccount;
}

function transformToAccountId(value: string): string | null {
  if (!value) {
    return null;
  }

  const accountId = transformToAddress(value);

  return !accountId ? null : accountId;
}

function createOption(address: string): Option {
  let isRecent: boolean | undefined;
  const pair = keyring.getAccount(address);
  let name: string | undefined;

  if (pair) {
    name = pair.meta.name;
  } else {
    const addr = keyring.getAddress(address);

    if (addr) {
      name = addr.meta.name;
      isRecent = addr.meta.isRecent;
    } else {
      isRecent = true;
    }
  }

  return createItem(createOptionItem(address, name), !isRecent);
}

function readOptions(): Record<string, Record<string, string>> {
  return (store.get(STORAGE_KEY) as Record<string, Record<string, string>>) || { defaults: {} };
}

function getLastValue(type: KeyringOption$Type = DEFAULT_TYPE): string {
  const options = readOptions();

  return options.defaults[type];
}

function setLastValue(type: KeyringOption$Type = DEFAULT_TYPE, value: string): void {
  const options = readOptions();

  options.defaults[type] = value;
  store.set(STORAGE_KEY, options);
}

function renderLabel({ value }: KeyringSectionOption): React.ReactNode {
  if (!value) {
    return undefined;
  }

  return getAddressName(value);
}

function InputAddress({
  className = "",
  defaultValue,
  filter,
  help,
  hideAddress = false,
  isDisabled = false,
  isError,
  isInput,
  isMultiple,
  label,
  labelExtra,
  onChange: _onChange,
  onChangeMulti: _onChangeMulti,
  options,
  optionsAll,
  placeholder,
  type = DEFAULT_TYPE,
  value: propsValue,
  withEllipsis,
  withLabel,
  helpText,
}: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasInjectedAccounts } = useApi();
  const hasOptions = useMemo(
    () => (options && options.length !== 0) || (optionsAll && Object.keys(optionsAll[type]).length !== 0),
    [options, optionsAll, type]
  );

  const value = useMemo((): string | undefined | (string | undefined)[] => {
    try {
      return (propsValue as any) || undefined;
    } catch (error) {
      return undefined;
    }
  }, [propsValue]);

  const filteredOptions = useMemo((): Option[] => {
    return !optionsAll ? [] : optionsAll[type].filter(({ value }) => !filter || (!!value && filter.includes(value)));
  }, [filter, optionsAll, type]);

  const lastValue = useMemo((): string => getLastValue(type), [type]);

  const firstOption = useMemo((): KeyringSectionOption | undefined => {
    return filteredOptions.length ? filteredOptions[0] : undefined;
  }, [filteredOptions]);

  const hasValue = useCallback(
    (test?: Uint8Array | string | null): boolean => {
      return filteredOptions.some(({ value }) => test === value);
    },
    [filteredOptions]
  );

  const onChange = useCallback(
    (address: string): void => {
      !filter && setLastValue(type, address);

      _onChange && _onChange(transformToAccountId(address));
    },
    [filter, _onChange, type]
  );

  const onChangeMulti = useCallback(
    (addresses: string[]): void => {
      if (_onChangeMulti) {
        _onChangeMulti(addresses.map(transformToAccountId).filter((address): string => address as string) as string[]);
      }
    },
    [_onChangeMulti]
  );

  // private getLastValue (): string {
  //   const { type } = this.props;
  //   const { lastValue: stateLast } = this.state;

  //   if (stateLast) {
  //     return stateLast;
  //   }

  //   const lastValue = getLastValue(type);

  //   this.setState({ lastValue });

  //   return lastValue;
  // }

  const onSearch = useCallback(
    (filteredOptions: KeyringSectionOptions, _query: string): KeyringSectionOptions => {
      const query = _query.trim();
      const queryLower = query.toLowerCase();
      const matches = filteredOptions.filter(
        (item): boolean =>
          !!item.value &&
          ((item.name.toLowerCase && item.name.toLowerCase().includes(queryLower)) ||
            item.value.toLowerCase().includes(queryLower))
      );

      if (isInput && matches.length === 0) {
        const accountId = transformToAccountId(query);

        if (accountId) {
          matches.push(keyring.saveRecent(accountId.toString()).option);
        }
      }

      return matches.filter((item, index): boolean => {
        const isLast = index === matches.length - 1;
        const nextItem = matches[index + 1];
        const hasNext = nextItem && nextItem.value;

        return !(isNull(item.value) || isUndefined(item.value)) || (!isLast && !!hasNext);
      });
    },
    [isInput]
  );

  const actualValue = useMemo(
    (): StringOrNull =>
      transformToAddress(
        isDisabled || (defaultValue && hasValue(defaultValue))
          ? defaultValue
          : hasValue(lastValue)
          ? lastValue
          : firstOption && firstOption.value
      ),
    [defaultValue, hasValue, isDisabled, firstOption, lastValue]
  );

  const actualOptions = useMemo((): Option[] => {
    return options
      ? options.map((o): Option => createItem(o))
      : isDisabled && actualValue
      ? [createOption(actualValue)]
      : filteredOptions;
  }, [actualValue, filteredOptions, isDisabled, options]);

  const _defaultValue = useMemo(() => (isMultiple || !isUndefined(value) ? undefined : actualValue), [
    actualValue,
    isMultiple,
    value,
  ]);

  if (!hasOptions) {
    return (
      <Dropdown
        className={classes("ui--InputAddress", hideAddress && "hideAddress", className)}
        defaultValue={_defaultValue}
        help={help}
        isDisabled
        isError={isError}
        isMultiple={isMultiple}
        label={label}
        labelExtra={labelExtra}
        onSearch={onSearch}
        options={[
          {
            key: "none",
            name: "none",
            text: <NoAccount />,
            value: "none",
          },
        ]}
        placeholder={placeholder}
        renderLabel={isMultiple ? renderLabel : undefined}
        value={"none"}
        withEllipsis={withEllipsis}
        withLabel={withLabel}
      >
        {!hasInjectedAccounts && browserName && isSupported && (
          <InputStatus
            text={
              <>
                {t("Please reload this app with the")}{" "}
                <a href={availableExtensions[browserName][0].link} rel="noopener noreferrer" target="_blank">
                  {t("Polkadot extension")}
                </a>{" "}
                {t("to show available accounts")}
                {"."}
              </>
            }
          />
        )}
      </Dropdown>
    );
  }

  return (
    <Dropdown
      className={classes("ui--InputAddress", hideAddress && "hideAddress", className)}
      defaultValue={_defaultValue}
      help={help}
      isDisabled={isDisabled || !hasOptions}
      isError={isError}
      isMultiple={isMultiple}
      label={label}
      labelExtra={labelExtra}
      onChange={isMultiple ? onChangeMulti : onChange}
      onSearch={onSearch}
      options={actualOptions}
      placeholder={placeholder}
      renderLabel={isMultiple ? renderLabel : undefined}
      value={isMultiple && !value ? MULTI_DEFAULT : value}
      withEllipsis={withEllipsis}
      withLabel={withLabel}
    >
      {!hasInjectedAccounts && actualOptions.length === 0 && (
        <InputStatus
          text={<>{t("Please reload this app with the Polkadot extension to show available accounts.")}</>}
        />
      )}
      {helpText ? <InputStatus text={helpText} /> : null}
    </Dropdown>
  );
}

const ExportedComponent = withMulti(
  styled(InputAddress)`
    .ui.dropdown .text {
      width: 100%;
    }

    .claimButton {
      margin-top: 0.5rem;
    }

    .ui.disabled.search {
      pointer-events: all;
    }

    .ui.search.selection.dropdown {
      > .text > .ui--KeyPair {
        .ui--IdentityIcon-Outer {
          border: 1px solid #888;
          border-radius: 50%;
          left: -2.75rem;
          top: -1.05rem;

          svg {
            height: 32px;
            width: 32px;
          }
        }

        .name {
          margin-left: 0;
        }
      }
    }

    &.hideAddress .ui--KeyPair .address {
      flex: 0;
      max-width: 0;
    }
  `,
  withObservable(keyring.keyringOption.optionsSubject, {
    propName: "optionsAll",
    transform: (optionsAll: KeyringOptions): Record<string, (Option | React.ReactNode)[]> =>
      Object.entries(optionsAll).reduce((result: Record<string, (Option | React.ReactNode)[]>, [type, options]): Record<
        string,
        (Option | React.ReactNode)[]
      > => {
        result[type] = options.map((option): Option | React.ReactNode =>
          option.value === null ? createHeader(option) : createItem(option)
        );

        const evmOptions = getEvmOptions();

        result.evm = evmOptions.map((option: any): Option | React.ReactNode =>
          option.value === null ? createHeader(option) : createItem(option)
        );

        return result;
      }, {}),
  })
) as ExportedType;

ExportedComponent.createOption = createItem;
ExportedComponent.setLastValue = setLastValue;

export default ExportedComponent;
