// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from "@canvas-ui/react-components/types";
import { classes } from "@canvas-ui/react-util";
import React from "react";
import styled from "styled-components";
import Icon from "./Icon";
import MessageArg from "./MessageArg";

export interface Props extends BareProps {
  message: any;
  params?: any[];
  isConstructor: boolean;
  withTooltip?: boolean;
}

function MessageSignature({ className, isConstructor, message }: Props): React.ReactElement<Props> {
  return (
    <div className={classes(className, isConstructor && "isConstructor")}>
      <span className="ui--MessageSignature-name">{isConstructor ? "constructor" : message.name}</span>(
      {message.inputs.map(
        (arg: any, index: number): React.ReactNode => {
          return (
            <React.Fragment key={arg.name}>
              <MessageArg arg={arg} />
              {index < message.inputs.length - 1 && ", "}
            </React.Fragment>
          );
        }
      )}
      )
      {!isConstructor && message.stateMutability === "view" && (
        <>
          <span className="ui--MessageSignature-returnType">
            {message.outputs.length ? ":" + " " + message.outputs[0].type : ""}
          </span>
        </>
      )}
      {!isConstructor && message.stateMutability !== "view" && !message.payable && (
        <>
          <Icon className="ui--MessageSignature-icon" data-for={`mutates-${message.name}`} data-tip name="database" />
        </>
      )}
      {!isConstructor && message.stateMutability !== "view" && message.payable && (
        <>
          <Icon
            className="ui--MessageSignature-icon"
            data-for={`payable-${message.name}`}
            data-tip
            name="paper plane"
          />
        </>
      )}
    </div>
  );
}

export default React.memo(
  styled(MessageSignature)`
    font-family: monospace;
    font-weight: normal;
    flex-grow: 1;

    .ui--MessageSignature-icon {
      color: var(--orange-primary);
      margin-left: 0.5rem;
      opacity: 0.6;
    }

    .ui--MessageSignature-name {
      color: var(--orange-primary);
      font-weight: bold;
    }

    &.isConstructor .ui--MessageSignature-name {
      color: var(--blue-primary);
    }

    .ui--MessageSignature-type {
    }

    .ui--MessageSignature-returnType {
    }
  `
);
