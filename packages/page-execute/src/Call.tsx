// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from "@canvas-ui/apps/types";
import {
  Button,
  ContractParams,
  Dropdown,
  InputAddress,
  InputNumber,
  MessageArg,
  MessageSignature,
  TxButton,
} from "@canvas-ui/react-components";
import { useAccountId, useApi, useContractAccountInfo, useGasWeight, useIntegerBn } from "@canvas-ui/react-hooks";
import { useTxParams } from "@canvas-ui/react-params";
import { extractValues } from "@canvas-ui/react-params/values";
import { getContractForAddress } from "@canvas-ui/react-util";
import { isNull } from "@polkadot/util";
import BN from "bn.js";
import { Contract } from "ethers";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Outcome from "./Outcome";
import { useTranslation } from "./translate";
import { CallResult } from "./types";

type Options = { key: string; text: React.ReactNode; value: number }[];

const emptyArray: any = [];

function getCallMessageOptions(callContract: Contract | null): Options {
  console.log("哦哦哦");
  return callContract
    ? Object.keys(callContract.interface.functions).map((key, index): {
        key: string;
        text: React.ReactNode;
        value: number;
      } => {
        const message = callContract.interface.functions[key];
        return {
          key,
          text: <MessageSignature message={message} registry={callContract.registry} />,
          value: index,
        };
      })
    : emptyArray;
}

const PAYMENT = new BN(0);
const GASLIMIT = new BN("300000000");

function Call({ className, navigateTo }: Props): React.ReactElement<Props> | null {
  const pageParams: { address?: string; messageIndex?: string } = useParams();
  const { api } = useApi();
  const { t } = useTranslation();
  const { name } = useContractAccountInfo(pageParams.address?.toString() || null, true);

  const [messageIndex, setMessageIndex] = useState(parseInt(pageParams.messageIndex || "0", 10));
  const [outcomes, setOutcomes] = useState<CallResult[]>([]);

  const [contract, hasRpc] = useMemo((): [Contract | null, boolean] => {
    try {
      const contract = getContractForAddress(api, pageParams.address || null);
      const hasRpc = contract?.hasRpcContractsCall || false;

      return [contract, hasRpc];
    } catch (e) {
      console.error(e);

      return [null, false];
    }
  }, [api, pageParams.address]);

  const txArgs = useMemo(() => {
    const messages =
      Object.keys(contract?.interface.functions || []).map((x: any) => {
        return contract?.interface.functions[x].inputs;
      }) || emptyArray;

    return messages[messageIndex];
  }, [contract, messageIndex]);

  const [params, values = [], setValues] = useTxParams(txArgs as any);

  const encoder = useCallback((): Uint8Array | null => {
    return contract?.abi?.messages[messageIndex]
      ? ((contract.abi.messages[messageIndex].toU8a(extractValues(values || [])) as unknown) as Uint8Array)
      : null;
  }, [contract?.abi?.messages, messageIndex, values]);

  useEffect((): void => {
    const newMessage = contract?.abi?.messages[messageIndex] || null;

    if (hasRpc) {
      if (!newMessage || newMessage.isMutating) {
        setUseRpc(false);
      } else {
        setUseRpc(true);
      }
    }
  }, [contract?.abi?.messages, hasRpc, messageIndex]);

  const [accountId, setAccountId] = useAccountId();
  const [payment, setPayment, isPaymentValid] = useIntegerBn(PAYMENT);
  const [gasLimit, setGasLimit, isGasLimitValid] = useIntegerBn(GASLIMIT);

  const [useRpc, setUseRpc] = useState(hasRpc && !contract?.abi?.messages[messageIndex].isMutating);

  const messageOptions = useMemo((): Options => getCallMessageOptions(contract), [contract]);

  useEffect((): void => {
    setOutcomes([]);
  }, [contract]);

  const _constructTx = useCallback((): any[] => {
    const data = encoder();

    if (!accountId || !data || !contract || !contract.address) {
      return [];
    }

    return [contract.address.toString(), payment, gasLimit, data];
  }, [accountId, contract, encoder, payment, gasLimit]);

  const _onSubmitRpc = useCallback((): void => {
    if (!accountId || !contract || !payment || !gasLimit) return;

    !!contract &&
      contract
        .read(messageIndex, 0, gasLimit, ...extractValues(values))
        .send(accountId)
        .then((result): void => {
          setOutcomes([
            {
              ...result,
              from: accountId,
              message: contract.abi.messages[messageIndex],
              params: extractValues(values),
              when: new Date(),
            },
            ...outcomes,
          ]);
        });
  }, [accountId, contract, messageIndex, payment, gasLimit, outcomes, values]);

  const _onClearOutcome = useCallback(
    (outcomeIndex: number) => (): void => {
      setOutcomes(outcomes.slice(0, outcomeIndex).concat(outcomes.slice(outcomeIndex + 1)));
    },
    [outcomes]
  );

  const isValid = useMemo(
    (): boolean =>
      !!accountId && !!contract && !!contract.address && !!contract.abi && isGasLimitValid && isPaymentValid,
    [accountId, contract, isPaymentValid, isGasLimitValid]
  );

  if (isNull(contract) || isNull(messageIndex) || !contract) {
    return null;
  }

  return (
    <div className={className}>
      <header>
        <h1>
          {t<string>("Execute {{name}}", { replace: { name } })}
        </h1>
        <div className="instructions">
          {t<string>("Using the unique code hash you can add on-chain contract code for you to deploy.")}
        </div>
      </header>
      <section className={className}>
        {contract && (
          <>
            <InputAddress
              defaultValue={accountId}
              help={t<string>(
                "Specify the user account to use for this contract call. And fees will be deducted from this account."
              )}
              label={t<string>("Call from Account")}
              onChange={setAccountId}
              type="testing"
              value={accountId}
            />
            <Dropdown
              defaultValue={messageIndex}
              help={t<string>(
                "The message to send to this contract. Parameters are adjusted based on the ABI provided."
              )}
              isError={messageIndex >= contract?.abi?.messages.length}
              label={t<string>("Message to Send")}
              onChange={setMessageIndex}
              options={messageOptions}
              value={messageIndex}
            />
            <ContractParams onChange={setValues} params={params} values={values} />
            <InputNumber isError={!isPaymentValid} label={t<string>("value")} onChange={setPayment} value={payment} />
            <InputNumber
              isError={!isGasLimitValid}
              label={t<string>("gasLimit")}
              onChange={setGasLimit}
              value={gasLimit}
            />
            <Dropdown
              onChange={setUseRpc}
              options={[
                {
                  text: t<string>("Send as RPC call"),
                  value: true,
                },
                {
                  text: t<string>("Send as transaction"),
                  value: false,
                },
              ]}
              value={useRpc}
            />
          </>
        )}
        <Button.Group>
          <Button label={t<string>("Cancel")} onClick={navigateTo.execute} />
          {useRpc ? (
            <Button isDisabled={!isValid} isPrimary label={t<string>("Call")} onClick={_onSubmitRpc} />
          ) : (
            <TxButton
              accountId={accountId}
              isDisabled={!isValid}
              isPrimary
              label={t<string>("Call")}
              params={_constructTx}
              tx="contracts.call"
            />
          )}
        </Button.Group>
      </section>
      {outcomes.length > 0 && (
        <footer>
          <h3>{t<string>("Call results")}</h3>
          <div className="outcomes">
            {outcomes.map(
              (outcome, index): React.ReactNode => (
                <Outcome
                  key={`outcome-${index}`}
                  onClear={_onClearOutcome(index)}
                  outcome={outcome}
                  registry={contract.registry}
                />
              )
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

export default React.memo(styled(Call)`
  .rpc-toggle {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }

  .clear-all {
    float: right;
  }

  .outcomes {
    > :not(:last-child) {
      margin-bottom: 1rem;
    }
  }
`);
