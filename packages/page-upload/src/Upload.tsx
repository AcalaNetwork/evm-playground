// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import store from "@canvas-ui/apps/store";
import { ComponentProps as Props } from "@canvas-ui/apps/types";
import { Button, Input, InputABI, TxButton } from "@canvas-ui/react-components";
import { useAbi, useAccountId, useApi, useFile, useNonEmptyString } from "@canvas-ui/react-hooks";
import { FileState } from "@canvas-ui/react-hooks/types";
import { SubmittableResult } from "@polkadot/api";
import { isNull } from "@polkadot/util";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "./translate";

function Upload({ basePath, navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useAccountId();
  const [name, setName, isNameValid, isNameError] = useNonEmptyString();
  const currentName = useRef(name);
  const [wasmFromFile, setWasmFromFile, isWasmFromFileSupplied, isWasmFromFileValid] = useFile({
    onChange: ({ name }: FileState): void => {
      if (currentName.current === "") {
        setName(name);
      }
    },
    validate: (file: FileState) => file?.data.subarray(0, 4).toString() === "0,97,115,109"
  });
  const { abi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();
  const [abiFile, setAbiFile] = useFile({ onChange: onChangeAbi, onRemove: onRemoveAbi });

  const [[wasm, isWasmValid], setWasm] = useState<[Uint8Array | null, boolean]>([null, false]);

  useEffect((): void => {
    if (abi) {
      setWasm([abi.bytecode, true]);

      return;
    }

    setWasm([null, false]);
  }, [abi, wasmFromFile, isWasmFromFileValid, isWasmFromFileSupplied, setName]);

  const isSubmittable = useMemo((): boolean => !isNull(name) && (!isAbiSupplied || isAbiValid), [
    name,
    isAbiSupplied,
    isAbiValid
  ]);

  const _onChangeName = useCallback(
    (name: string | null): void => {
      setName(name);
      currentName.current = name;
    },
    [setName]
  );

  const onUpload = useCallback((): void => {
    store
      .saveCode({ abi: abi, name, tags: [] })
      .then((id): void => navigateTo.uploadSuccess(id)())
      .catch((error: any): void => {
        console.error("Unable to save abi", error);
      });
  }, [abi, name, navigateTo]);

  return (
    <>
      <header>
        <h1>{t<string>("Upload Contract abi bundle")}</h1>
        <div className="instructions">{t<string>("You can upload an existing Contract Abi here.")}</div>
      </header>
      <section>
        <Input
          help={t<string>("A name for this Contract Abi to help users distinguish. Only used for display purposes.")}
          isError={isNameError}
          label={t<string>("Name")}
          onChange={_onChangeName}
          placeholder={t<string>("Give your Contract a descriptive name")}
          value={name}
        />
        <InputABI
          abi={abi}
          errorText={errorText}
          file={abiFile}
          isError={isAbiError}
          isSupplied={isAbiSupplied}
          isValid={isAbiValid}
          setFile={setAbiFile}
          withLabel
        />
        <Button.Group>
          <Button
            isDisabled={!isSubmittable}
            label={t<string>("Upload")}
            isPrimary={true}
            onClick={() => onUpload()}
          />
        </Button.Group>
      </section>
    </>
  );
}

export default React.memo(Upload);
