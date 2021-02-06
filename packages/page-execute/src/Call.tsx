// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from "@canvas-ui/apps/types";
import { Signer as EvmSigner } from "@acala-network/bodhi";
import { decodeAddress } from "@polkadot/util-crypto";
import { keyring } from "@polkadot/ui-keyring";
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
import { useAccountId, useApi, useContractAccountInfo, useNotification, useIntegerBn } from "@canvas-ui/react-hooks";
import { useTxParams } from "@canvas-ui/react-params";
import { extractValues } from "@canvas-ui/react-params/values";
import { getContractForAddress } from "@canvas-ui/react-util";
import { TestingSigner } from "@canvas-ui/react-api/TestingSigner";
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
  const { api, evmProvider, accountSigner } = useApi();
  const { t } = useTranslation();
  const { name } = useContractAccountInfo(pageParams.address?.toString() || null, true);

  const [messageIndex, setMessageIndex] = useState(parseInt(pageParams.messageIndex || "0", 10));
  const [outcomes, setOutcomes] = useState<CallResult[]>([]);
  const showNotification = useNotification();
  const [contract] = useMemo((): [Contract | null] => {
    try {
      const contract = getContractForAddress(api, pageParams.address || null);

      return [contract];
    } catch (e) {
      console.error(e);

      return [null];
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

  const [accountId, setAccountId] = useAccountId();
  const [payment, setPayment, isPaymentValid] = useIntegerBn(PAYMENT);
  const [gasLimit, setGasLimit, isGasLimitValid] = useIntegerBn(GASLIMIT);

  const [isLoading, setIsLoading] = useState(false);

  const cmessage = useMemo(() => {
    const messages =
      Object.keys(contract?.interface.functions || []).map((x: any) => {
        return contract?.interface.functions[x];
      }) || emptyArray;

    return messages[messageIndex];
  }, [contract, messageIndex]);

  const [useRpc, setUseRpc] = useState(cmessage ? cmessage.stateMutability === "view" : true);

  const messageOptions = useMemo((): Options => getCallMessageOptions(contract), [contract]);

  useEffect(() => {
    if (cmessage) {
      setUseRpc(cmessage.stateMutability === "view");
    }
  }, [cmessage]);

  useEffect((): void => {
    setOutcomes([]);
  }, [contract]);

  const _onSubmitRpc = useCallback(async () => {
    if (!accountId || !contract || !payment || !gasLimit) return;

    const wallet = new EvmSigner(evmProvider, accountId, accountSigner);

    try {
      const messages = contract.interface.functions;
      const messageName = Object.keys(messages)[messageIndex];

      const result = await contract.connect(wallet as any)[messageName](
        ...values.map((x, index) => {
          if (params[index] && (params as any)[index].baseType && (params as any)[index].baseType === "array") {
            try {
              return JSON.parse(x.value as any);
            } catch {
              return (x as any).value.split(",").map((s: any) => s.trim());
            }
          }
          return x.value;
        })
      );

      setOutcomes([
        {
          result,
          from: accountId,
          message: messages[messageName],
          params: extractValues(values),
          when: new Date(),
        } as any,
        ...outcomes,
      ]);
    } catch (error) {
      showNotification({
        action: typeof error === "string" ? error : error && error.message ? error.message : "",
        status: "error",
      });
    }
  }, [accountId, contract, messageIndex, payment, gasLimit, outcomes, values]);

  const _onSubmitExecute = useCallback(async () => {
    if (!accountId || !contract || !payment || !gasLimit) return;
    setIsLoading(true);
    try {
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

      const wallet = new EvmSigner(evmProvider, accountId, signer);

      const messages = contract.interface.functions;
      const messageName = Object.keys(messages)[messageIndex];

      await contract.connect(wallet as any)[messageName](
        ...values.map((x, index) => {
          if (params[index] && (params as any)[index].baseType && (params as any)[index].baseType === "array") {
            try {
              return JSON.parse(x.value as any);
            } catch {
              return (x as any).value.split(",").map((s: any) => s.trim());
            }
          }
          return x.value;
        }),
        {
          gasLimit: gasLimit.toString(),
          value: payment.toString(),
        }
      );

      showNotification({
        action: messageName,
        status: "success",
      });
    } catch (error) {
      showNotification({
        action: typeof error === "string" ? error : error && error.message ? error.message : "",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [accountId, contract, messageIndex, payment, gasLimit, outcomes, values]);

  const _onClearOutcome = useCallback(
    (outcomeIndex: number) => (): void => {
      setOutcomes(outcomes.slice(0, outcomeIndex).concat(outcomes.slice(outcomeIndex + 1)));
    },
    [outcomes]
  );

  const isValid = useMemo(
    (): boolean =>
      !!accountId && !!contract && !!contract.address && !!contract.interface && isGasLimitValid && isPaymentValid,
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
              // type="allPlus"
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
            <InputNumber bitLength={128} isError={!isPaymentValid} label={t<string>("value")} onChange={setPayment} value={payment} />
            <InputNumber
              isError={!isGasLimitValid}
              label={t<string>("gasLimit")}
              onChange={setGasLimit}
              value={gasLimit}
            />
          </>
        )}
        <Button.Group>
          <Button label={t<string>("Cancel")} onClick={navigateTo.execute} />
          {useRpc ? (
            <Button isDisabled={!isValid} isPrimary label={t<string>("Call")} onClick={_onSubmitRpc} />
          ) : (
            <Button
              isLoading={isLoading}
              isDisabled={!isValid}
              isPrimary
              label={t<string>("Execute")}
              onClick={_onSubmitExecute}
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
