// Copyright 2017-2020 @canvas-ui/ui-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Option } from './types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../logos, specifically in namedLogos
//   text: The text you wish to display in the dropdown
//   value: The actual ss5Format value (as registered)
export default function create (t: <T= string> (key: string, text: string, options: { ns: string }) => T): Option[] {
  return [
    {
      info: 'default',
      text: t<string>('ss58.default', 'Default for the connected node', { ns: 'apps-config' }),
      value: -1
    },
    {
      info: 'substrate',
      text: t<string>('ss58.substrate', 'Substrate (generic)', { ns: 'apps-config' }),
      value: 42
    },
    {
      info: 'polkadot',
      text: t<string>('ss58.polkadot', 'Polkadot (live)', { ns: 'apps-config' }),
      value: 0
    },
    {
      info: 'kusama',
      text: t<string>('ss58.kusmaa', 'Kusama (canary)', { ns: 'apps-config' }),
      value: 2
    },
    {
      info: 'edgeware',
      text: t<string>('ss58.edgeware', 'Edgeware (live)', { ns: 'apps-config' }),
      value: 7
    },
    {
      info: 'centrifuge',
      text: t<string>('ss58.centrifuge', 'Centrifuge (live)', { ns: 'apps-config' }),
      value: 36
    }
  ];
}
