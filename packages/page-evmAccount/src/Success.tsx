// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button, AddressMini } from "@canvas-ui/react-components";
import { useApi } from "@canvas-ui/react-hooks";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "./translate";

function Success({ allCodes, basePath, navigateTo }: any): React.ReactElement<any> | null {
  const { id }: { id: string } = useParams();
  const { accountId }: { accountId: string } = useParams();
  const [evmAccount, setEvmAccount] = useState("");
  const { t } = useTranslation();
  const { hasInjectedAccounts, evmProvider, accountSigner, api, systemChain } = useApi();

  useEffect(() => {
    if (accountId && evmProvider && evmProvider.api) {
      evmProvider.api.isReady.then(() => {
        evmProvider.api.query.evmAccounts.evmAddresses(accountId).then((result) => {
          if (result.isEmpty) {
            setEvmAccount("");
          } else {
            setEvmAccount(result.toString());
          }
        });
      });
    } else {
      setEvmAccount("");
    }
  }, [evmProvider, accountId]);

  return (
    <>
      <header>
        <h1>{t<string>("Successfully bind an evm account")}</h1>
        <div className="instructions">{"Your Substrate account is already bound to an evm account."}</div>
      </header>
      <section>
        <div>
          Substrate Account Address:{" "}
          <span style={{ marginLeft: 16 }}>
            <AddressMini withAddress value={accountId}>
              {accountId}
            </AddressMini>
          </span>
        </div>
        <div>
          Evm Account Address:{" "}
          <span style={{ marginLeft: 16 }}>
            <AddressMini withAddress theme="ethereum" value={evmAccount}>
              {evmAccount}
            </AddressMini>
          </span>
        </div>
        <Button.Group>
          <Button label={t<string>("Back")} onClick={navigateTo.newEvmAccount} />
        </Button.Group>
      </section>
    </>
  );
}

export default React.memo(Success);
