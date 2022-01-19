// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from "@canvas-ui/apps/types";
import { Button, Input, InputAddress, Labelled } from "@canvas-ui/react-components";
import React, { useMemo, useState } from "react";
import { useTranslation } from "./translate";
import { createClaimPayload } from "@acala-network/eth-transactions";
import { useAccountId, useNotification } from "@canvas-ui/react-hooks";

function Binding({ navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const showNotification = useNotification();
  const [accountId, setAccountId] = useAccountId();
  const [substrateAddress, setSubstrateAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [genesisHash, setGenesisHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const isSubmittable = useMemo(() => {
    return substrateAddress && genesisHash && chainId;
  }, [substrateAddress, genesisHash, chainId]);

  const onSign = async () => {
    setIsLoading(true);
    try {
      const payload = createClaimPayload({
        chainId,
        substrateAddress,
        salt: genesisHash
      });

      const msgParams = JSON.stringify(payload);
      const from = accountId;
      const params = [from, msgParams];
      const method = "eth_signTypedData_v4";

      const result = await new Promise((resolve, reject) => {
        (window as any).web3.currentProvider.sendAsync(
          {
            method,
            params,
            from
          },
          (err: any, result: any) => {
            if (err || result.error) return reject(err || result.error);
            resolve(result.result);
          }
        );
      });

      setResult(result as string);
    } catch (error) {
      showNotification({
        action: "bind account",
        message: (error as Error).message,
        status: "error"
      });
      setResult("");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(result);

  return (
    <>
      <header>
        <h1>{t<string>("Create the signature of the claim")}</h1>
      </header>
      <section>
        <InputAddress
          isInput={false}
          label={t<string>("The evm address to bind")}
          onChange={setAccountId}
          value={accountId}
        />
        <Input
          // help={t<string>("A name for this Contract Abi to help users distinguish. Only used for display purposes.")}
          label={t<string>("Substrate address")}
          onChange={setSubstrateAddress}
          placeholder={t<string>("Substrate address")}
          value={substrateAddress || ""}
        />
        <Input
          // help={t<string>("A name for this Contract Abi to help users distinguish. Only used for display purposes.")}
          label={t<string>("Chain id")}
          onChange={setChainId}
          placeholder={t<string>("Chain id")}
          value={chainId || ""}
        />
        <Input
          // help={t<string>("A name for this Contract Abi to help users distinguish. Only used for display purposes.")}
          label={t<string>("Genesis hash")}
          onChange={setGenesisHash}
          placeholder={t<string>("Genesis hash")}
          value={genesisHash}
        />

        <Button.Group>
          <Button
            isLoading={isLoading}
            isDisabled={!isSubmittable}
            label={t<string>("Sign")}
            isPrimary={true}
            onClick={() => onSign()}
          />
        </Button.Group>

        {result && (
          <Labelled label={t<string>("signature")}>
            <div style={{ wordBreak: "break-all" }}>{result}</div>
          </Labelled>
        )}
      </section>
    </>
  );
}

export default React.memo(Binding);
