// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import store from "@canvas-ui/apps/store";
import { Code, ComponentProps } from "@canvas-ui/apps/types";
import { ELEV_2_CSS } from "@canvas-ui/react-components/styles/constants";
import { useAbi } from "@canvas-ui/react-hooks";
import { VoidFn } from "@canvas-ui/react-util/types";
import React, { useCallback } from "react";
import styled from "styled-components";
import Abi from "./Abi";
import Button from "./Button";
import CodeForget from "./CodeForget";
import CodeInfo from "./CodeInfo";
import { useTranslation } from "./translate";

interface Props extends ComponentProps {
  code: Code;
  onForget?: VoidFn;
}

function CodeCard({
  className,
  code,
  code: { id },
  navigateTo,
  onForget: _onForget
}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { abi, isAbiSupplied } = useAbi(code);

  const onDeploy = useCallback((): void => {
    navigateTo.deployNew(id)();
  }, [id, navigateTo]);

  const onForget = useCallback((): void => {
    store.forgetCode(id);

    _onForget && _onForget();
  }, [id, _onForget]);

  return (
    <article className={className}>
      <CodeInfo code={code} isEditable>
        {isAbiSupplied && abi && <Abi abi={abi} withConstructors />}
      </CodeInfo>
      <div className="footer">
        <Button.Group>
          <CodeForget code={code} onForget={onForget} />
          <Button isDisabled={!isAbiSupplied} isPrimary label={t<string>("Deploy")} onClick={onDeploy} />
        </Button.Group>
      </div>
    </article>
  );
}

export default styled(React.memo(CodeCard))`
  ${ELEV_2_CSS}

  .footer {
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0 0;
    padding: 1rem 0 0;
    border-top: 1px solid var(--grey40);
  }
`;
