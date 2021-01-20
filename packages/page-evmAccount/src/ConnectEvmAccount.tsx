// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ExtensionSigner } from "@acala-network/bodhi/ExtensionSigner";
import { ComponentProps as Props } from "@canvas-ui/apps/types";
import { Button, InputAddress, InputEvmAddress } from "@canvas-ui/react-components";
import { testAccount } from "@canvas-ui/react-components/InputEvmAddress/testAccount";
import { useAccountId, useApi, useNotification } from "@canvas-ui/react-hooks";
import { keccak256 } from "@ethersproject/keccak256";
import { SigningKey } from "@ethersproject/signing-key";
import { default as React, useEffect, useReducer, useState } from "react";
import { useTranslation } from "./translate";
import { Link } from "react-router-dom";

export default React.memo(function EvmAccount({ navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useAccountId();
  const [accountEvmId, setAccountEvmId] = useState<string | null>();
  const [isSending, setIsSending] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isClaimedEvm, setIsClaimedEvm] = useState(false);
  const [i, update] = useReducer((x) => x + 1, 0);
  const { hasInjectedAccounts, evmProvider, evmSigner } = useApi();
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
    if (!accountEvmId || !accountId || !evmProvider) {
      setIsSending(false);
      return;
    }

    const test = testAccount.find(({ value }) => value.toLowerCase() === accountEvmId.toLowerCase());
    if (test) {
      const evmSigner = {
        async signRaw({ address, data }: any) {
          const hashData = keccak256(data);
          const signingKey = new SigningKey(test.pk);
          return {
            signature: signingKey.signDigest(hashData) as any,
          };
        },
      };

      const wallet = new ExtensionSigner(evmProvider, accountId, evmSigner);
      try {
        setIsSending(true);
        await wallet.bindAccount(accountEvmId);
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
    } else {
      try {
        const wallet = new ExtensionSigner(evmProvider, accountId, evmSigner);
        setIsSending(true);

        await wallet.bindAccount(accountEvmId);
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

        <InputEvmAddress
          defaultValue={accountEvmId}
          help={t<string>("The evm account that needs to be bound")}
          label={<div>{t<string>("Evm Account")}</div>}
          onChange={(value) => setAccountEvmId(value)}
          helpText={isClaimedEvm ? "An substrate account already exists to bind to this account" : ""}
          type="evm"
          value={accountEvmId}
        />

        <Button.Group>
          <Button
            isLoading={isSending}
            isDisabled={isSending || isClaimed || isClaimedEvm}
            isPrimary
            onClick={() => claimEVMAccount()}
            label={t<string>("Claim")}
          />
        </Button.Group>
      </section>
    </main>
  );
});
