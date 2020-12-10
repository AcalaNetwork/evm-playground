// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isUndefined } from "@polkadot/util";
import getInitValue from "./initValue";
import { RawParam } from "./types";

export function createValue(param: { type: string }): RawParam {
  const value = getInitValue(param.type);

  return {
    isValid: !isUndefined(value),
    value
  };
}

export function extractValues(values: RawParam[]): string[] {
  return values.map(({ value }) => value as string);
}

export default function createValues(params: { type: string }[]): RawParam[] {
  return params.map(createValue);
}
