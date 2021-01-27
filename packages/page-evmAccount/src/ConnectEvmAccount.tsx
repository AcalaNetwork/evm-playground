// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Signer as EvmSigner } from "@acala-network/bodhi";
import { ComponentProps as Props } from "@canvas-ui/apps/types";
import { Button, InputAddress, Toggle, InputEvmAddress } from "@canvas-ui/react-components";
import { testAccount } from "@canvas-ui/react-components/InputEvmAddress/testAccount";
import { useAccountId, useApi, useNotification } from "@canvas-ui/react-hooks";
import { keccak256 } from "@ethersproject/keccak256";
import { SigningKey } from "@ethersproject/signing-key";
import { default as React, useEffect, useReducer, useState } from "react";
import { useTranslation } from "./translate";
import { Link } from "react-router-dom";
import { keyring } from "@polkadot/ui-keyring";
import { TestingSigner } from "@canvas-ui/react-api/TestingSigner";

export default React.memo(function EvmAccount({ navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useAccountId();
  const [accountEvmId, setAccountEvmId] = useState<string | null>();
  const [isSending, setIsSending] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isClaimedEvm, setIsClaimedEvm] = useState(false);
  const [i, update] = useReducer((x) => x + 1, 0);
  const { hasInjectedAccounts, evmProvider, accountSigner, api } = useApi();
  const showNotification = useNotification();

  useEffect(() => {
    if (accountId && evmProvider && evmProvider.api) {
      evmProvider.api.isReady.then(() => {
        evmProvider.api.query.evmAccounts.evmAddresses(accountId).then((result) => {
          if (result.isEmpty) {
            setIsClaimed(false);
          } else {
            setIsClaimed(true);
          }
        });
      });
    } else {
      setIsClaimed(false);
    }
  }, [accountId, i]);

  useEffect(() => {
    if (accountEvmId && evmProvider && evmProvider.api) {
      evmProvider.api.isReady.then(() => {
        evmProvider.api.query.evmAccounts.accounts(accountEvmId).then((result) => {
          if (result.isEmpty) {
            setIsClaimedEvm(false);
          } else {
            setIsClaimedEvm(true);
          }
        });
      });
    } else {
      setIsClaimedEvm(false);
    }
  }, [accountEvmId, i]);

  const claimEVMAccount = async () => {
    if (!accountId || !evmProvider || (!isDefault && !accountEvmId)) {
      setIsSending(false);
      return;
    }

    const pair = keyring.getPair(accountId);

    const {
      meta: { isInjected },
    } = pair;

    let signer: any;

    if (isInjected) {
      signer = accountSigner;
    } else {
      signer = new TestingSigner(api.registry, pair);
    }

    try {
      if (isDefault) {
        const wallet = new EvmSigner(evmProvider, accountId, signer);
        setIsSending(true);
        await wallet.claimDefaultAccount();
      } else {
        const wallet = new EvmSigner(evmProvider, accountId, accountSigner);
        setIsSending(true);
        await wallet.claimEvmAccount(accountEvmId as any);
      }

      showNotification({
        action: "Claim Evm Account",
        status: "success",
      });
    } catch (error) {
      showNotification({
        action: typeof error === "string" ? error : error && error.message ? error.message : "",
        status: "error",
      });
    } finally {
      update();
      setIsSending(false);
    }
  };

  return (
    <main className="upload--App">
      <header>
        <h1>{t<string>("Bind Evm Account")}</h1>
        <div className="instructions">
          {t<string>("You can specify an evm account that is bound to your substrate account. ")}
          <Link to={"/evmAccount/new"}>Generate an new evm account</Link>
        </div>
      </header>
      <section>
        <InputAddress
          defaultValue={accountId}
          help={t<string>("Specify the substrate account that is bound to the evm account")}
          label={t<string>("Substrate Account")}
          onChange={setAccountId}
          // type="allPlus"
          withoutEvm={true}
          helpText={isClaimed ? "An evm account already exists to bind to this account" : ""}
          value={accountId}
        />

        <Toggle
          label={t<string>(isDefault ? "Bind default evm Account" : "Bind existing evm address")}
          onChange={setIsDefault}
          value={isDefault}
        />

        {!isDefault && (
          <InputEvmAddress
            defaultValue={accountEvmId}
            help={t<string>("The evm account that needs to be bound")}
            label={<div>{t<string>("Evm Account")}</div>}
            onChange={(value) => setAccountEvmId(value)}
            helpText={isClaimedEvm ? "An substrate account already exists to bind to this account" : ""}
            type="evm"
            value={accountEvmId}
          />
        )}

        <Button.Group>
          <Button
            isLoading={isSending}
            isDisabled={isSending || isClaimed || (!isDefault && isClaimedEvm)}
            isPrimary
            onClick={() => claimEVMAccount()}
            label={t<string>("Claim")}
          />
        </Button.Group>
      </section>
    </main>
  );
});
