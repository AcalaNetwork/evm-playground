// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import store from "@canvas-ui/apps/store";
import { ComponentProps as Props } from "@canvas-ui/apps/types";
import { Button, Input, InputABI } from "@canvas-ui/react-components";
import { useAbi, useFile, useNonEmptyString } from "@canvas-ui/react-hooks";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "./translate";

function Upload({ navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [name, setName, _, isNameError] = useNonEmptyString("");
  const { abi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();
  const [abiFile, setAbiFile] = useFile({ onChange: onChangeAbi, onRemove: onRemoveAbi });

  const isSubmittable = useMemo((): boolean => !!name && isAbiValid, [name, isAbiValid]);

  console.log("isAbiSupplied", isAbiSupplied);
  console.log("isAbiValid", isAbiValid);

  const _onChangeName = useCallback(
    (name: string | null): void => {
      setName(name);
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
          value={name || ""}
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
          <Button isDisabled={!isSubmittable} label={t<string>("Upload")} isPrimary={true} onClick={() => onUpload()} />
        </Button.Group>
      </section>
    </>
  );
}

export default React.memo(Upload);
