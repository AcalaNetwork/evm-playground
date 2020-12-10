// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ELEV_3_CSS } from "@canvas-ui/react-components/styles/constants";
import { BareProps } from "@canvas-ui/react-components/types";
import { useToggle } from "@canvas-ui/react-hooks";
import React from "react";
import styled from "styled-components";
import Expander from "./Expander";
import Messages from "./Messages";
import { useTranslation } from "./translate";

interface Props extends BareProps {
  abi: {
    bytecode: any;
    evm: any;
    abi: any;
  };
  withConstructors?: boolean;
}

function Abi({ abi, className, withConstructors = false }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isAbiOpen, toggleIsAbiOpen] = useToggle();

  return (
    <div className={className}>
      <Expander isOpen={isAbiOpen} onClick={toggleIsAbiOpen} summary={t<string>("ABI")}>
        <Messages abi={abi} isLabelled={false} isRemovable={false} withConstructors={withConstructors} />
      </Expander>
    </div>
  );
}

export default styled(React.memo(Abi))`
  .contract-info {
    ${ELEV_3_CSS}
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    width: 100%;

    .name {
    }

    .details {
      font-size: 0.8rem;
      color: var(--grey60);
    }
  }
`;
