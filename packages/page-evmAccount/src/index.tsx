import { AppProps as Props } from "@canvas-ui/apps/types";
import React, { useMemo } from "react";
import { Route, Switch } from "react-router";
import ConnectEvmAccount from "./ConnectEvmAccount";
import NewEvmAccount from "./NewEvmAccount";
import Success from "./Success";

function EvmAccount({ basePath, navigateTo }: Props): React.ReactElement<Props> {
  const componentProps = useMemo(
    () => ({
      basePath,
      navigateTo,
    }),
    [basePath, navigateTo]
  );

  return (
    <main className="deploy--App">
      <Switch>
        <Route path={`${basePath}/new`}>
          <NewEvmAccount {...componentProps} />
        </Route>
        <Route path={`${basePath}/success/:accountId`}>
          <Success {...componentProps} />
        </Route>
        <Route exact>
          <ConnectEvmAccount {...componentProps} />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(EvmAccount);
