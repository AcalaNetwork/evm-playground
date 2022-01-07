// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from "@canvas-ui/apps/types";
import { ComponentProps } from "./types";

import React, { useCallback, useMemo } from "react";
import { Route, Switch } from "react-router";
import { WithLoader } from "@canvas-ui/react-components";
import { useAccounts, useContracts } from "@canvas-ui/react-hooks";
import { classes } from "@canvas-ui/react-util";

import Add from "./Add";
import Call from "./Call";
import Contracts from "./Contracts";

function ExecuteApp({ basePath, className, navigateTo }: Props): React.ReactElement<Props> {
  const { allAccounts, isReady: isAccountsReady } = useAccounts();
  const allContracts = Object.keys(localStorage)
    .map(x => x.match(/contract:(0x[0-9a-zA-Z]{40})/)?.[1])
    .filter(x => x) as string[];
  const isContract = useCallback(
    (address: string) => {
      return allContracts.includes(address);
    },
    [allContracts]
  );
  const hasContracts = !!allContracts.length;

  const componentProps = useMemo(
    (): ComponentProps => ({
      accounts: allAccounts,
      basePath,
      contracts: allContracts,
      hasContracts,
      isContract,
      navigateTo
    }),
    [allAccounts, allContracts, basePath, hasContracts, isContract, navigateTo]
  );

  return (
    <main style={{ width: "720px" }} className={classes(className, "execute--App")}>
      <WithLoader isLoading={false}>
        <Switch>
          <Route path={`${basePath}/add`}>
            <Add {...componentProps} />
          </Route>
          <Route path={`${basePath}/:address/:messageIndex?`}>
            <Call {...componentProps} />
          </Route>
          <Route exact>
            <Contracts {...componentProps} />
          </Route>
        </Switch>
      </WithLoader>
    </main>
  );
}

export default React.memo(ExecuteApp);
