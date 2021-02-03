// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Signer as EvmSigner } from "@acala-network/bodhi";
import { ComponentProps as Props } from "@canvas-ui/apps/types";
import { Button, InputAddress, Input, Toggle, InputEvmAddress } from "@canvas-ui/react-components";
import { testAccount } from "@canvas-ui/react-components/InputEvmAddress/testAccount";
import { useAccountId, useApi, useNotification } from "@canvas-ui/react-hooks";
import { keccak256 } from "@ethersproject/keccak256";
import { SigningKey } from "@ethersproject/signing-key";
import { default as React, useEffect, useMemo, useReducer, useState } from "react";
import { useTranslation } from "./translate";
import { Link } from "react-router-dom";
import { keyring } from "@polkadot/ui-keyring";
import { TestingSigner } from "@canvas-ui/react-api/TestingSigner";
import { Form, Radio } from "semantic-ui-react";

export default React.memo(function EvmAccount({ navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useAccountId();
  const [accountEvmId, setAccountEvmId] = useState<string | null>();
  const [isSending, setIsSending] = useState(false);
  const [isSendingFaucet, setIsSendingFaucet] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const [isClaimed, setIsClaimed] = useState("");
  const [isClaimedEvm, setIsClaimedEvm] = useState("");
  const [i, update] = useReducer((x) => x + 1, 0);
  const { hasInjectedAccounts, evmProvider, accountSigner, api, systemChain } = useApi();
  const showNotification = useNotification();

  useEffect(() => {
    if (accountId && evmProvider && evmProvider.api) {
      evmProvider.api.isReady.then(() => {
        evmProvider.api.query.evmAccounts.evmAddresses(accountId).then((result) => {
          if (result.isEmpty) {
            setIsClaimed("");
          } else {
            setIsClaimed(result.toString());
          }
        });
      });
    } else {
      setIsClaimed("");
    }
  }, [evmProvider, accountId, i]);

  useEffect(() => {
    if (accountEvmId && evmProvider && evmProvider.api) {
      evmProvider.api.isReady.then(() => {
        evmProvider.api.query.evmAccounts.accounts(accountEvmId).then((result) => {
          if (result.isEmpty) {
            setIsClaimedEvm("");
          } else {
            setIsClaimedEvm(result.toString());
          }
        });
      });
    } else {
      setIsClaimedEvm("");
    }
  }, [evmProvider, accountEvmId, i]);

  const defaultAddress = useMemo(() => {
    if (!accountId || !evmProvider) {
      return "";
    }
    const wallet = new EvmSigner(evmProvider, accountId, accountSigner);
    return wallet.computeDefaultEvmAddress();
  }, [accountId, evmProvider, accountSigner]);

  const faucet = () => {
    if (!accountId) return;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    setIsSendingFaucet(true);
    window
      .fetch("https://api.polkawallet.io/v2/faucet-tc6/faucet", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          account: accountId,
          address: accountId,
          strategy: "normal",
        }),
      })
      .then((response: any) => response.json())
      .then((result: any) => {
        if (result.code !== 200) {
          showNotification({
            action: "Faucet",
            message: result.message,
            status: "error",
          });
        } else {
          showNotification({
            action: "Faucet",
            status: "success",
          });
        }
      })
      .catch((error: any) => {
        showNotification({
          action: "Faucet",
          message: error.message,
          status: "error",
        });
      })
      .finally(() => {
        setIsSendingFaucet(false);
      });
  };
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

      navigateTo.bindSuccess(accountId)();
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
        <h1>{t<string>("Setup EVM Account")}</h1>
        <div className="instructions">
          {t<string>(
            "Bind an EVM account to your Substrate account, so that you can use a single account for any transactions on Acala. "
          )}
          <a
            target="_blank"
            href={"https://wiki.acala.network/learn/basics/acala-evm/acala-evm-composable-defi-stack/evm-account"}
          >
            {" "}
            Read more.
          </a>
        </div>
      </header>
      <section>
        <div>
          <h3 style={{ marginBottom: "1.5em" }}>Step 1: Select a Substrate Account.</h3>
          <span>
            Note: if you have not yet installed {"polkadot{js}"} browser extension and set up a Substrate, please follow{" "}
            <a
              href="https://wiki.polkadot.network/docs/en/learn-account-generation#polkadotjs-browser-plugin"
              target="_blank"
            >
              instructions here
            </a>{" "}
            before proceeding.
          </span>
          <InputAddress
            defaultValue={accountId}
            // help={t<string>("Specify the substrate account that is bound to the evm account")}
            // label={t<string>("Substrate Account")}
            onChange={setAccountId}
            // type="allPlus"
            withoutEvm={true}
            isErrorStatus={!!isClaimed}
            helpText={!!isClaimed ? `${isClaimed} is already bound to this account` : ""}
            value={accountId}
          />
          {systemChain === "Acala Mandala TC6" ? (
            <div style={{ display: "flex", marginTop: "16px", alignItems: "center" }}>
              <div style={{ marginRight: "16px" }}>
                <Button
                  isLoading={isSendingFaucet}
                  isDisabled={!accountId}
                  isPrimary
                  onClick={() => faucet()}
                  label={t<string>("Faucet")}
                />
              </div>
              <div>Fund the account by using the faucet</div>
            </div>
          ) : null}
        </div>
        <div>
          <h3 style={{ marginBottom: "1.5em" }}>Step 2: Bind an EVM to the selected Substrate Account</h3>
          <span style={{ marginBottom: "20px", display: "inline-block" }}>
            You can bind an auto-generated EVM address or an existing EVM account. Read more{" "}
            <a
              href="https://app.gitbook.com/@acala/s/wiki/learn/basics/acala-evm/acala-evm-composable-defi-stack/single-account"
              target="_blank"
            >
              here
            </a>
            .
          </span>

          <Form.Field style={{ marginBottom: "16px" }}>
            <Radio
              label="Bind an auto-generated EVM address"
              name="radioGroup"
              value="this"
              checked={isDefault}
              onChange={() => setIsDefault(true)}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label="Bind an existing EVM address (Coming soon)"
              name="radioGroup"
              value="that"
              checked={!isDefault}
              onChange={() => setIsDefault(false)}
            />
          </Form.Field>
        </div>
        {isDefault && (
          <div>
            <h3 style={{ marginBottom: "0" }}>Step 3: Bind an auto-generated EVM address</h3>
            <Input isDisabled={true} value={`Generated EVM address: ${defaultAddress}`} />
          </div>
        )}
        {!isDefault && (
          <div>
            <h3 style={{ marginBottom: "1.5em" }}>Step 3: Bind an existing EVM address</h3>
            <span>
              This feature is coming soon, read how it works{" "}
              <a
                href="https://app.gitbook.com/@acala/s/wiki/learn/basics/acala-evm/acala-evm-composable-defi-stack/evm-account#2-bind-an-existing-ethereum-account"
                target="_blank"
              >
                here
              </a>
              .
            </span>
            <InputEvmAddress
              defaultValue={accountEvmId}
              onChange={(value) => setAccountEvmId(value)}
              helpText={!!isClaimedEvm ? `${isClaimedEvm} is already bound to this account` : ""}
              type="evm"
              value={accountEvmId}
            />
          </div>
        )}

        <Button.Group>
          <Button
            isLoading={isSending}
            isDisabled={isSending || !!isClaimed || (!isDefault && !!isClaimedEvm)}
            isPrimary
            onClick={() => claimEVMAccount()}
            label={t<string>("Bind")}
          />
        </Button.Group>
      </section>
    </main>
  );
});
