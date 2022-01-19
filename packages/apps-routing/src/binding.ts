// Copyright 2017-2020 @canvas-ui/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from "./types";

import Component from "@canvas-ui/app-binding";

export default function binding(t: <T = string>(key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [],
      needsCodes: true
    },
    name: "Bind Account",
    text: t<string>("nav.bindingAccount", "Bind Account", { ns: "apps-bind-account" })
  };
}
