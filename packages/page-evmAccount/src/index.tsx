// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wallet } from "@acala-network/bodhi/Signer";
import { ExtensionSigner } from "@acala-network/bodhi/ExtensionSigner";
import { ComponentProps as Props } from "@canvas-ui/apps/types";
import { Button, InputAddress, InputEvmAddress } from "@canvas-ui/react-components";
import { useAccountId, useApi, useNotification } from "@canvas-ui/react-hooks";
import { decodeAddress } from "@polkadot/util-crypto";
import { default as React, useEffect, useReducer, useState } from "react";
import { useTranslation } from "./translate";

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

function EvmAccount({ navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useAccountId();
  const [accountEvmId, setAccountEvmId] = useState<string | null>();
  const [isSending, setIsSending] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isClaimedEvm, setIsClaimedEvm] = useState(false);
  const [i, update] = useReducer(x => x + 1, 0);
  const { hasInjectedAccounts, evmProvider } = useApi();
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

    const test = testAccount.find(({ value }) => value.toLowerCase() === accountEvmId.toLowerCase())
    if (test) {
      const wallet = new Wallet(test.pk, evmProvider, accountId);

      try {
        setIsSending(true);
        await wallet.claimEvmAccounts();
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
        update()
        setIsSending(false);
      }
    } else {
      try {
        const wallet = new ExtensionSigner(evmProvider, accountId);
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
        update()
        setIsSending(false);
      }
    }
  };

  return (
    <main className="upload--App">
      <header>
        <h1>{t<string>("Bind Evm Account")}</h1>
        <div className="instructions">
          {t<string>("You can specify an evm account that is bound to your substrate account.")}
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
          label={t<string>("Evm Account")}
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
}

export default React.memo(EvmAccount);
