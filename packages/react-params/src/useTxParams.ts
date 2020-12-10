// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RawParams, UseTxParamsHook } from "./types";

import { useEffect, useState } from "react";
import createValues from "./values";

export default function useTxParams(source: { type: string }[]): UseTxParamsHook {
  const [params, setParams] = useState(source);
  const [values, setValues] = useState<RawParams>(createValues(params));

  useEffect((): void => {
    console.log("哈哈哈哈");
    setParams(source);
    setValues(createValues(source));
  }, [source]);

  return [params, values, setValues];
}
