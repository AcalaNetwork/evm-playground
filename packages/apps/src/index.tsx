// Copyright 2017-2020 @canvas-ui/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// setup these right at front
import "./initSettings";
import "semantic-ui-css/semantic.min.css";
import "tippy.js/dist/tippy.css"; // optional
import "@canvas-ui/react-components/i18n";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import store from "store";
import { ThemeProvider } from "styled-components";
import { Api } from "@canvas-ui/react-api";
import Queue from "@canvas-ui/react-components/Status/Queue";
import { BlockAuthors, Events } from "@canvas-ui/react-query";
import settings from "@polkadot/ui-settings";

import Apps from "./Apps";

const rootId = "root";
const rootElement = document.getElementById(rootId);
const theme = { theme: settings.uiTheme };

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

// cleanups for old/unused storage items
store.each((_, key): void => {
  if (key.startsWith("hooks:sessionSlashes:")) {
    store.remove(key);
  }
});

ReactDOM.render(
  <Suspense fallback="...">
    <ThemeProvider theme={theme}>
      <Queue>
        {/* <Api url={settings.apiUrl}> */}

        <HashRouter>
          <Apps />
        </HashRouter>
        {/* </Api> */}
      </Queue>
    </ThemeProvider>
  </Suspense>,
  rootElement
);
