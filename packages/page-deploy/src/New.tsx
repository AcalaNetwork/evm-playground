// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Code } from "@canvas-ui/apps/types";
import { Button, ContractParams, InputAddress, InputName, InputNumber, Labelled } from "@canvas-ui/react-components";
import { ELEV_2_CSS } from "@canvas-ui/react-components/styles/constants";
import { useAbi, useAccountId, useIntegerBn, useNonEmptyString, useNotification } from "@canvas-ui/react-hooks";
import { useTxParams } from "@canvas-ui/react-params";
import { truncate } from "@canvas-ui/react-util";
import keyring from "@polkadot/ui-keyring";
import BN from "bn.js";
import { BigNumber, ContractFactory, providers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "./translate";
import { ComponentProps as Props } from "./types";
const ENDOWMENT = new BN("0");
const GASLIMIT = new BN("5332001");

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
  const [isSending, setIsSending] = useState(false);
  const showNotification = useNotification();

  const args = useMemo(() => {
    const constructors = abi?.filter((x: any) => x.type === "constructor") || [];
    const constructor = constructors[0];
    return constructor?.inputs || [];
  }, [abi]);

  const [params, values = [], setValues] = useTxParams(args);

  const isValid = useMemo(
    (): boolean => isNameValid && isEndowmentValid && !!accountId && values.every(v => v.value !== ""),
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

  const isNonPayable = abi?.find(item => item.type === "constructor")?.stateMutability === "nonpayable";

  const deploy = async () => {
    if (!accountId || !bytecode || !abi) return;
    setIsSending(true);

    try {
      const provider = new providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();

      const factory = new ContractFactory(abi, bytecode, signer);
      const contract = await factory.deploy(...values.map(x => x.value), {
        gasLimit: BigNumber.from(34132001n),
        gasPrice: BigNumber.from(200786445289n),
        value: endowment ? (endowment.isZero() ? undefined : endowment) : undefined,
      });


      await contract.deployed();

      keyring.saveContract(contract.address, {
        contract: {
          abi: abi || undefined,
          genesisHash: "0x0000000000000000000000000000000000000000"
        },
        name,
        tags: []
      });

      showNotification({
        action: "Deploy Contract",
        status: "success"
      });

      navigateTo.execute();
    } catch (error) {
      showNotification({
        action: typeof error === "string" ? error : error && error.message ? error.message : "",
        status: "error"
      });
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
          label={t<string>("Deployment account")}
          onChange={setAccountId}
          // type="allPlus"
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
        {isNonPayable && (
          <InputNumber
            bitLength={128}
            isError={!isEndowmentValid}
            label={t<string>("value")}
            onChange={setEndowment}
            value={endowment}
          />
        )}
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
