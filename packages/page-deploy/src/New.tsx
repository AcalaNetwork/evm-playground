// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Code } from "@canvas-ui/apps/types";
import { Button, InputAddress, ContractParams, InputName, InputNumber, Labelled } from "@canvas-ui/react-components";
import { ELEV_2_CSS } from "@canvas-ui/react-components/styles/constants";
import { useAbi, useAccountId, useApi, useGasWeight, useIntegerBn, useNonEmptyString } from "@canvas-ui/react-hooks";
import { truncate } from "@canvas-ui/react-util";
import BN from "bn.js";
import { useTxParams } from "@canvas-ui/react-params";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
// import { ABI, InputMegaGas, InputName, MessageSignature, Params } from './shared';
import { useTranslation } from "./translate";
import { ComponentProps as Props } from "./types";

type ConstructOptions = { key: string; text: React.ReactNode; value: string }[];

const ENDOWMENT = new BN(0);
const GASLIMIT = new BN(0);

function defaultContractName(name?: string) {
  return name ? `${name}` : "";
}

function New({ allCodes, className, navigateTo }: Props): React.ReactElement<Props> | null {
  const { id, index = "0" }: { id: string; index?: string } = useParams();
  const { t } = useTranslation();
  const code = useMemo((): Code | null => {
    return allCodes.find((code: Code) => id === code.id) || null;
  }, [allCodes, id]);
  const useWeightHook = useGasWeight();
  const { isValid: isWeightValid, weight } = useWeightHook;
  const [accountId, setAccountId] = useAccountId();
  const [endowment, setEndowment, isEndowmentValid] = useIntegerBn(ENDOWMENT);
  const [gasLimit, setGasLimit, isGasLimitValid] = useIntegerBn(GASLIMIT);
  const [name, setName, isNameValid, isNameError] = useNonEmptyString(t(defaultContractName(code?.name)));
  const { abi } = useAbi(code);

  // const constructOptions = useMemo((): ConstructOptions => {
  //   if (!abi) {
  //     return [];
  //   }

  //   return abi.abi.map((constructor, index) => {
  //     return {
  //       key: `${index}`,
  //       text: <MessageSignature isConstructor message={constructor} registry={abi.registry} />,
  //       value: `${index}`
  //     };
  //   });
  // }, [abi]);

  const isValid = useMemo((): boolean => isNameValid && isEndowmentValid && isWeightValid && !!accountId, [
    accountId,
    isEndowmentValid,
    isNameValid,
    isWeightValid
  ]);

  const args = useMemo(() => {
    const constructors = abi?.filter((x: any) => x.type === "constructor") || [];
    console.log(constructors)
    const constructor = constructors[0];
    return constructor?.inputs || [];
  }, [abi]);

  console.log('args', args);

  const [params, values = [], setValues] = useTxParams(args);
  // const encoder = useCallback((): Uint8Array | null => {
  //   return abi?.constructors[constructorIndex]
  //     ? ((abi.constructors[constructorIndex].toU8a(extractValues(values || [])) as unknown) as Uint8Array)
  //     : null;
  // }, [abi?.constructors, constructorIndex, values]);

  useEffect((): void => {
    setName(t(defaultContractName(code?.name)));
  }, [code, setName, t]);

  console.log('values:', values)
  // const _constructCall = useCallback((): any[] => {
  //   if (!abi || constructorIndex < 0) {
  //     return [];
  //   }

  //   return [endowment, weight, code?.codeHash || null, encoder()];
  // }, [code, constructorIndex, abi, encoder, endowment, weight]);

  // const _onSuccess = useCallback(
  //   (result: SubmittableResult): void => {
  //     const section = api.tx.contracts ? "contracts" : "contract";
  //     const records = result.filterRecords(section, "Instantiated");

  //     if (records.length) {
  //       // find the last EventRecord (in the case of multiple contracts deployed - we should really be
  //       // more clever here to find the exact contract deployed, this works for eg. Delegator)
  //       const address = (records[records.length - 1].event.data[1] as unknown) as AccountId;

  //       keyring.saveContract(address.toString(), {
  //         contract: {
  //           abi: abi?.json || undefined,
  //           genesisHash: api.genesisHash.toHex()
  //         },
  //         name,
  //         tags: []
  //       });

  //       navigateTo.deploySuccess(address.toString())();
  //     }
  //   },
  //   [abi, api, name, navigateTo]
  // );

  // const additionalDetails = useMemo(
  //   (): Record<string, any> => ({
  //     constructor: constructOptions[constructorIndex]?.text,
  //     // data: encoder ? u8aToHex(encoder()) : null,
  //     name: name || "",
  //     params: params.map((param, index) => ({
  //       arg: <MessageArg arg={param} registry={abi?.registry} />,
  //       type: param.type,
  //       value: values[index].value
  //     })),
  //     weight: weight.toString()
  //   }),
  //   [abi?.registry, name, constructOptions, constructorIndex, params, values, weight]
  // );

  useEffect((): void => {
    if (!abi) {
      navigateTo.deploy();
    }
  }, [abi, navigateTo]);

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
          type="account"
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
          <Button icon="cloud upload" isDisabled={!isValid} isPrimary label={t<string>("Deploy")} withSpinner />
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
