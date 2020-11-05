// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson, Codec, Registry, TypeDef } from '@polkadot/types/types';

import { useMemo } from 'react';
import { createTypeUnsafe, TypeRegistry } from '@polkadot/types';

function formatData (registry: Registry, data: AnyJson, type: TypeDef | undefined): Codec {
  return createTypeUnsafe(registry, type?.type || 'Raw', [data], true);
}

export default function useCodec (registry: TypeRegistry, source: AnyJson, type?: TypeDef): [Codec, string] {
  return useMemo(
    (): [Codec, string] => {
      const codec = formatData(registry, [source], type);

      let asString = '()';

      if (type) {
        asString = codec.toString();
      }

      return [codec, asString];
    },
    [registry, source, type]
  );
}
