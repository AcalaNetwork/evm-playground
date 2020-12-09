// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from "@canvas-ui/react-components/types";

import React from "react";
import styled from "styled-components";
import { Abi } from "@polkadot/api-contract";
import { classes } from "@canvas-ui/react-util";

import Message from "./Message";

export interface Props extends BareProps {
  abi: any;
  address?: string;
  isLabelled?: boolean;
  isRemovable: boolean;
  onRemove?: () => void;
  onSelect?: (messageIndex: number) => () => void;
  onSelectConstructor?: (constructorIndex: number) => void;
  withConstructors?: boolean;
}

function Messages(props: Props): React.ReactElement<Props> {
  const { abi, className = "", isLabelled, /* isRemovable, onRemove = NOOP, */ withConstructors } = props;

  const constructors = abi.filter((x: any) => x.type === "constructor");
  const messages = abi.filter((x: any) => x.type === "function");

  return (
    <div className={classes(className, "ui--Messages", isLabelled && "labelled")}>
      {withConstructors &&
        constructors.map(
          (constructor: any, index: any): React.ReactNode => (
            <Message isConstructor key={`constructor-${index}`} message={constructor} />
          )
        )}
      {messages.map(
        (message: any, index: any): React.ReactNode => (
          <Message key={`message-${index}`} message={message} />
        )
      )}
    </div>
  );
}

export default React.memo(styled(Messages)`
  .remove-abi {
    float: right;

    &:hover,
    &:hover :not(i) {
      text-decoration: underline;
    }
  }
`);
