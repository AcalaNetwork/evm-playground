// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from "@canvas-ui/apps/types";
import { Button, Input } from "@canvas-ui/react-components";
import { Keyring } from "@polkadot/keyring";
import { randomAsHex } from "@polkadot/util-crypto";
import { default as React, useEffect, useState } from "react";
import { useTranslation } from "./translate";

export default React.memo(function NewEvmAccount({ navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [privateKey, setPrivateKey] = useState<string>("");
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [pair, setPair] = useState<any>(null);

  useEffect(() => {
    setPrivateKey(randomAsHex(32));
  }, []);

  useEffect(() => {
    if (privateKey) {
      try {
        const keyring = new Keyring();
        const pair = keyring.createFromUri(privateKey, { name: name }, "ethereum");
        setPair(pair);
      } catch {
        setPair(null);
      }
    }
  }, [privateKey, name]);

  const download = () => {
    setIsSubmited(true);
    if (!password) return;
    const data = pair.toJson(password);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const fileName = `${pair.address}.json`;
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <main className="upload--App">
      <header>
        <h1>{t<string>("Generate a new evm account")}</h1>
        <div className="instructions">
          You can generate a new evm account and download its keystore, then import the keystore into{" "}
          <a href="https://polkadot.js.org/extension/" target="_blank">
            polkadot extension
          </a>{" "}
          to use it.
        </div>
      </header>
      <section>
        <Input
          help={t<string>("Private key of evm account")}
          label={t<string>("ethereum private key")}
          onChange={setPrivateKey}
          placeholder={t("ethereum private key")}
          value={privateKey}
          withStatus
          isError={!pair}
          status={pair ? pair.address : "Invalid private key"}
        />
        <Input
          isError={!name && isSubmited}
          help={t<string>("Account name")}
          label={t<string>("name")}
          onChange={setName}
          placeholder={t("new account")}
          value={name}
        />
        <Input
          isError={!password && isSubmited}
          type="password"
          help={t<string>("Password for keystore")}
          label={t<string>("password")}
          onChange={setPassword}
          placeholder={t("password")}
          value={password}
        />

        <Button.Group>
          <Button isPrimary onClick={() => download()} label={t<string>("Download Keystore")} />
        </Button.Group>
      </section>
    </main>
  );
});
