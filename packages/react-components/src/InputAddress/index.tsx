// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { availableExtensions } from "@canvas-ui/apps-config/extensions";
import { withMulti, withObservable } from "@canvas-ui/react-api/hoc";
import { useApi, useNotification } from "@canvas-ui/react-hooks";
import { classes, getAddressName, toAddress as addressToAddress } from "@canvas-ui/react-util";
import { StringOrNull } from "@canvas-ui/react-util/types";
import keyring from "@polkadot/ui-keyring";
import { createOptionItem } from "@polkadot/ui-keyring/options/item";
import {
  KeyringOption$Type,
  KeyringOptions,
  KeyringSectionOption,
  KeyringSectionOptions
} from "@polkadot/ui-keyring/options/types";
import { isNull, isUndefined } from "@polkadot/util";
import { detect } from "detect-browser";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import store from "store";
import styled from "styled-components";
import Dropdown from "../Dropdown";
import InputStatus from "../InputStatus";
import { useTranslation } from "../translate";
import { BareProps } from "../types";
import createHeader from "./createHeader";
import createItem from "./createItem";
import CopyButton from "../CopyButton";
import { NoAccount } from "./KeyPair";
import { Option } from "./types";
import Button from "../Button/Button";
import { ConnectMetamask } from "./ConnectMetamask";
import { Input, Labelled } from "..";

interface Props extends BareProps {
  defaultValue?: Uint8Array | string | null;
  filter?: string[];
  help?: React.ReactNode;
  hideAddress?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isErrorStatus?: boolean;
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
  withoutEvm?: boolean;
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
  try {
    return addressToAddress(value) || null;
  } catch (error) {
    console.error("Unable to transform address", value);
  }

  return null;
}

function getEvmOptions() {
  return [
    {
      key: "header-accounts",
      name: "Accounts",
      value: null
    },
    {
      key: "0x5FC7Ab607E91c02f896bC08AF0898b709d50E392",
      name: "evm",
      value: "0x5FC7Ab607E91c02f896bC08AF0898b709d50E392"
    },
    {
      key: "header-development",
      name: "Development",
      value: null
    },
    {
      key: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      name: "alice",
      value: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
    }
  ];
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
  isErrorStatus,
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
  withoutEvm,
  helpText
}: Props): React.ReactElement<Props> | null {
  // const { t } = useTranslation();
  // const { hasInjectedAccounts, evmProvider } = useApi();
  // const hasOptions = useMemo(
  //   () => (options && options.length !== 0) || (optionsAll && Object.keys(optionsAll[type]).length !== 0),
  //   [options, optionsAll, type]
  // );

  const ethereum = (window as any).ethereum;
  const [selectedAddress, setSelectedAddress] = useState((ethereum && ethereum.selectedAddress) || "");

  useEffect(() => {
    if (ethereum) {
      ethereum.on("accountsChanged", () => {
        setSelectedAddress(((window as any).ethereum && (window as any).ethereum.selectedAddress) || "");
      });
    }
  }, [ethereum]);

  // const value = useMemo((): string | undefined | (string | undefined)[] => {
  //   try {
  //     return Array.isArray(propsValue) ? propsValue.map(addressToAddress) : addressToAddress(propsValue) || undefined;
  //   } catch (error) {
  //     return undefined;
  //   }
  // }, [propsValue]);

  // const filteredOptions = useMemo((): Option[] => {
  //   return !optionsAll ? [] : optionsAll[type].filter(({ value }) => !filter || (!!value && filter.includes(value)));
  // }, [filter, optionsAll, type]);

  // const lastValue = useMemo((): string => getLastValue(type), [type]);

  // const lastOption = useMemo((): KeyringSectionOption | undefined => {
  //   return filteredOptions.length ? filteredOptions[filteredOptions.length - 1] : undefined;
  // }, [filteredOptions]);

  // const firstOption = useMemo((): KeyringSectionOption | undefined => {
  //   return filteredOptions.length ? filteredOptions[0] : undefined;
  // }, [filteredOptions]);

  // const hasValue = useCallback(
  //   (test?: Uint8Array | string | null): boolean => {
  //     return filteredOptions.some(({ value }) => test === value);
  //   },
  //   [filteredOptions]
  // );

  // const [evmAddress, setEvmAddress] = useState("");
  // const [isSending, setIsSending] = useState(false);
  // const showNotification = useNotification();

  // const onChange = useCallback(
  //   (address: string): void => {
  //     !filter && setLastValue(type, address);

  //     _onChange && _onChange(transformToAccountId(address));
  //   },
  //   [filter, _onChange, type]
  // );

  // const onChangeMulti = useCallback(
  //   (addresses: string[]): void => {
  //     if (_onChangeMulti) {
  //       _onChangeMulti(addresses.map(transformToAccountId).filter((address): string => address as string) as string[]);
  //     }
  //   },
  //   [_onChangeMulti]
  // );

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

  // const onSearch = useCallback(
  //   (filteredOptions: KeyringSectionOptions, _query: string): KeyringSectionOptions => {
  //     const query = _query.trim();
  //     const queryLower = query.toLowerCase();
  //     const matches = filteredOptions.filter(
  //       (item): boolean =>
  //         !!item.value &&
  //         ((item.name.toLowerCase && item.name.toLowerCase().includes(queryLower)) ||
  //           item.value.toLowerCase().includes(queryLower))
  //     );

  //     if (isInput && matches.length === 0) {
  //       const accountId = transformToAccountId(query);

  //       if (accountId) {
  //         matches.push(keyring.saveRecent(accountId.toString()).option);
  //       }
  //     }

  //     return matches.filter((item, index): boolean => {
  //       const isLast = index === matches.length - 1;
  //       const nextItem = matches[index + 1];
  //       const hasNext = nextItem && nextItem.value;

  //       return !(isNull(item.value) || isUndefined(item.value)) || (!isLast && !!hasNext);
  //     });
  //   },
  //   [isInput]
  // );

  // useEffect(() => {
  //   if (type !== "evm" && value && evmProvider && evmProvider.api) {
  //     evmProvider.api.isReady.then(() => {
  //       evmProvider.api.query.evmAccounts.evmAddresses(value).then(result => {
  //         if (result.isEmpty) {
  //           setEvmAddress("");
  //         } else {
  //           setEvmAddress(result.toString());
  //         }
  //       });
  //     });
  //   } else {
  //     setEvmAddress("");
  //   }
  // }, [value]);

  // const actualValue = useMemo(
  //   (): StringOrNull =>
  //     transformToAddress(
  //       isDisabled || (defaultValue && hasValue(defaultValue))
  //         ? defaultValue
  //         : hasValue(lastValue)
  //         ? lastValue
  //         : firstOption && firstOption.value
  //     ),
  //   [defaultValue, hasValue, isDisabled, firstOption, lastValue]
  // );

  // const actualOptions = useMemo((): Option[] => {
  //   return options
  //     ? options.map((o): Option => createItem(o))
  //     : isDisabled && actualValue
  //     ? [createOption(actualValue)]
  //     : filteredOptions;
  // }, [actualValue, filteredOptions, isDisabled, options]);

  // const _defaultValue = useMemo(() => (isMultiple || !isUndefined(value) ? undefined : actualValue), [
  //   actualValue,
  //   isMultiple,
  //   value
  // ]);

  return (
    <Labelled
      className={classes("ui--Dropdown", className)}
      help={help}
      label={label}
      isFull={true}
      labelExtra={labelExtra}
      withEllipsis={withEllipsis}
      withLabel={withLabel}
      style={{ width: "100%" }}
    >
      <div>
        <div>{selectedAddress || "No Address"}</div>
        {/* <Input value={selectedAddress || "No Address"} isFull={true} /> */}
        {!selectedAddress && <ConnectMetamask />}
        {helpText ? <InputStatus isError={isErrorStatus} text={helpText} /> : null}
      </div>
    </Labelled>
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
      }, {})
  })
) as ExportedType;

ExportedComponent.createOption = createItem;
ExportedComponent.setLastValue = setLastValue;

export default ExportedComponent;
