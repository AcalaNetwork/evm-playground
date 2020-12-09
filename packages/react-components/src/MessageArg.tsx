// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from "@canvas-ui/react-components/types";
import React from "react";

export interface Props extends BareProps {
  arg?: {
    name: string;
    type: string;
  };
}

function MessageArg({ arg }: Props): React.ReactElement<Props> | null {
  if (!arg) {
    return null;
  }

  return (
    <>
      {
        <>
          {arg.name}
          {": "}
        </>
      }
      <span>{arg.type}</span>
    </>
  );
}

export default React.memo(MessageArg);
