// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from "./types";

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button, CodeCard } from "@canvas-ui/react-components";

import { useTranslation } from "./translate";

function Codes({ allCodes, basePath, className, hasCodes, navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <header>
        <h1>{t(hasCodes ? "Deploy New Contract" : "No abi bundle available")}</h1>
        <div className="instructions">
          {hasCodes ? (
            <>
              {t<string>("Choose an abi bundle to deploy from below. Don’t see what you’re looking for?")}{" "}
              <Link to={"/upload"}>{t<string>("upload a new abi bundle")}</Link>
              {"."}
            </>
          ) : (
            <>
              {t<string>("You can add an existing abi bundle by")}{" "}
              <Link to={"/upload"}>{t<string>("uploading a new abi bundle")}</Link>
              {"."}
            </>
          )}
        </div>
      </header>
      <section>
        <div className="content">
          {hasCodes && <h3>{t<string>("Abi Bundles")}</h3>}
          {allCodes.map(
            (code): React.ReactNode => {
              return <CodeCard basePath={basePath} code={code} key={code.id} navigateTo={navigateTo} />;
            }
          )}
          <Button.Group>
            <Button label={t<string>("Upload New Contract abi bundle")} onClick={navigateTo.upload} />
          </Button.Group>
        </div>
      </section>
    </div>
  );
}

export default styled(React.memo(Codes))`
  .content {
    > :not(:last-child) {
      margin-bottom: 0.9rem;
    }
  }
`;
