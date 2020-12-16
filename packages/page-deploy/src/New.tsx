// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wallet } from "@acala-network/bodhi/Signer";
import { Code } from "@canvas-ui/apps/types";
import { Button, ContractParams, InputAddress, InputName, InputNumber, Labelled } from "@canvas-ui/react-components";
import { ELEV_2_CSS } from "@canvas-ui/react-components/styles/constants";
import { useAbi, useAccountId, useApi, useIntegerBn, useNonEmptyString } from "@canvas-ui/react-hooks";
import { useTxParams } from "@canvas-ui/react-params";
import { truncate } from "@canvas-ui/react-util";
import keyring from "@polkadot/ui-keyring";
import { decodeAddress } from "@polkadot/util-crypto";
import BN from "bn.js";
import { ContractFactory } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "./translate";
import { ComponentProps as Props } from "./types";

const ENDOWMENT = new BN("0");
const GASLIMIT = new BN("300000000");

function defaultContractName(name?: string) {
  return name ? `${name}` : "";
}

function New({ allCodes, className, navigateTo }: Props): React.ReactElement<Props> | null {
  const { id, index = "0" }: { id: string; index?: string } = useParams();
  const { t } = useTranslation();
  const code = useMemo((): Code | null => {
    return allCodes.find((code: Code) => id === code.id) || null;
  }, [allCodes, id]);
  const [accountId, setAccountId] = useAccountId();
  const [endowment, setEndowment, isEndowmentValid] = useIntegerBn(ENDOWMENT);
  const [gasLimit, setGasLimit, isGasLimitValid] = useIntegerBn(GASLIMIT);
  const [name, setName, isNameValid, isNameError] = useNonEmptyString(t(defaultContractName(code?.name)));
  const { abi, bytecode } = useAbi(code);
  const { evmProvider, api } = useApi();
  const [isSending, setIsSending] = useState(false);

  const args = useMemo(() => {
    const constructors = abi?.filter((x: any) => x.type === "constructor") || [];
    const constructor = constructors[0];
    return constructor?.inputs || [];
  }, [abi]);

  const [params, values = [], setValues] = useTxParams(args);

  const isValid = useMemo(
    (): boolean => isNameValid && isEndowmentValid && !!accountId && values.every((v) => v.value !== ""),
    [accountId, isEndowmentValid, isNameValid, values]
  );

  useEffect((): void => {
    setName(t(defaultContractName(code?.name)));
  }, [code, setName, t]);

  useEffect((): void => {
    if (!abi) {
      navigateTo.deploy();
    }
  }, [abi, navigateTo]);

  const deploy = async () => {
    if (!accountId || !bytecode || !abi) return;
    setIsSending(true);

    try {
      const wallet = new Wallet(decodeAddress(accountId, true), evmProvider, accountId);
      await wallet.claimEvmAccounts();

      const factory = new ContractFactory(abi, bytecode, wallet as any);
      const contract = await factory.deploy(...values.map((x) => x.value), {
        gasLimit: "3000000000",
      });

      await contract.deployed();

      keyring.saveContract(contract.address, {
        contract: {
          abi: abi || undefined,
          genesisHash: evmProvider.api.genesisHash.toHex(),
        },
        name,
        tags: [],
      });

      navigateTo.execute();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={className}>
      <header>
        <h1>
          {t<string>("Deploy {{contractName}}", { replace: { contractName: code?.name || "Contract" } })}
        </h1>
        <div className="instructions">
          {t<string>(
            "Choose an account to deploy the contract from, give it a descriptive name and set the endowment amount."
          )}
        </div>
      </header>
      <section>
        <InputAddress
          help={t<string>(
            "Specify the user account to use for this deployment. Any fees will be deducted from this account."
          )}
          isInput={false}
          label={t<string>("deployment account")}
          onChange={setAccountId}
          type="testing"
          value={accountId}
        />
        <InputName isContract isError={isNameError} onChange={setName} value={name || ""} />
        <Labelled label={t<string>("Abi Bundle")}>
          <div className="code-bundle">
            <div className="name">{code?.name || ""}</div>
            <div className="code-hash">{truncate(code?.codeHash || "", 16)}</div>
          </div>
        </Labelled>
        <ContractParams onChange={setValues} params={params || []} values={values} />
        <InputNumber isError={!isEndowmentValid} label={t<string>("value")} onChange={setEndowment} value={endowment} />
        <InputNumber isError={!isGasLimitValid} label={t<string>("gasLimit")} onChange={setGasLimit} value={gasLimit} />
        <Button.Group>
          <Button
            isLoading={isSending}
            icon="cloud upload"
            isDisabled={isSending || !isValid}
            isPrimary
            onClick={() => deploy()}
            label={t<string>("Deploy")}
          />
        </Button.Group>
      </section>
    </div>
  );
}

export default React.memo(styled(New)`
  .code-bundle {
    ${ELEV_2_CSS}
    display: block;
    padding: 0.625rem;
    width: 100%;

    .name {
      color: var(--grey60);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .code-hash {
      font-family: monospace;
      font-size: 1rem;
      color: var(--grey80);
    }
  }
`);
