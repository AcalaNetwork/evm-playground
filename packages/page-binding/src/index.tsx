// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from "@canvas-ui/apps/types";
import { ComponentProps } from "./types";

import React, { useMemo } from "react";
import { Route, Switch } from "react-router";
import useCodes from "@canvas-ui/apps/useCodes";

import Binding from "./Binding";

function UploadApp({ basePath, navigateTo }: Props): React.ReactElement<Props> {
  const useCodesHook = useCodes();
  const componentProps = useMemo((): ComponentProps => ({ ...useCodesHook, basePath, navigateTo }), [
    useCodesHook,
    basePath,
    navigateTo
  ]);

  return (
    <main className="upload--App" style={{ width: "720px" }}>
      <Switch>
        <Route exact>
          <Binding {...componentProps} />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(UploadApp);
