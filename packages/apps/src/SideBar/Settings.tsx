// Copyright 2017-2020 @canvas-ui/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps as Props } from '@canvas-ui/react-components/types';

import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Dropdown, Icon, Tooltip } from '@canvas-ui/react-components';
import { useEndpointOptions } from '@canvas-ui/react-util';
import { ELEV_4_CSS } from '@canvas-ui/react-components/styles/constants';
import { useEndpoints, useSettings } from '@canvas-ui/react-hooks';

import { useTranslation } from '../translate';

function Settings ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { onChangeKey } = useSettings(true);
  const endpointState = useEndpoints(onChangeKey('apiUrl'));
  const endpointOptions = useEndpointOptions(endpointState, t, true);

  const { onChangeUrl, url } = endpointState;

  return (
    <div className={`apps--SideBar-settings ${className || ''}`}>
      <Dropdown
        className='chain-dropdown'
        defaultValue={url}
        onChange={onChangeUrl}
        options={endpointOptions}
        withLabel={false}
      />
      <NavLink
        className='settings-link'
        data-for='settings-link'
        data-tip
        to='/settings'
      >
        <Icon name='setting' />
      </NavLink>
      <Tooltip
        place='top'
        text={t<string>('Settings')}
        trigger='settings-link'
      />
    </div>
  );
}

export default React.memo(styled(Settings)`
  align-items: center;
  bottom: 0;
  display: flex;
  left: 0;
  padding: 0 1rem 1rem;
  position: absolute;
  width: 100%;

  .chain-dropdown {
    flex-grow: 1;

    .ui.selection.dropdown {
      background: transparent;
      border-radius: 4px;
      border: 2px solid var(--grey30);
      color: var(--grey60);
      min-height: 32px;
      min-width: auto;
      padding: 0.5rem 0.75rem;

      &:hover {
        ${ELEV_4_CSS}
        color: var(--grey80);
      }

      &.active {
        background: transparent;
        border-color: transparent;

        .menu {
          ${ELEV_4_CSS}
          border: 0;
          width: 12.375rem;

          > .item {
            background: var(--grey40);
            display: flex;
            align-items: center;

            &:not(:last-child) {
              border-bottom: 1px solid #435966;
            }

            &.selected {
              background: var(--grey30);

              .chain-option {
                flex: 1;
              }

              &:after {
                content: '\f00c';
                font-family: Icons;
                font-size: 1rem;
              }
            }

            &:hover {
              background: var(--grey15);
            }
          }
        }
      }
    }
  }

  .settings-link {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    line-height: 21px;
    width: 32px;
    height: 32px;
    margin-left: 0.75rem;

    &, &:hover {
      color: var(--grey50);
    }

    &:hover {
      ${ELEV_4_CSS};
    }

    &.active {
      color: var(--grey80);
    }

    i.icon {
      margin-right: 0;
    }
  }

  // .apps--SideBar-logo-inner {
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  //   width: 10.5rem;

  //   img {
  //     flex: 0;
  //     height: 2.75rem;
  //     width: 2.75rem;
  //   }

  //   .icon.dropdown,
  //   > div.info {
  //     color: white;
  //     opacity: 0.75;
  //     text-align: right;
  //     vertical-align: middle;
  //   }

  //   .icon.dropdown {
  //     flex: 0;
  //     margin: 0;
  //   }

  //   > div.info {
  //     flex: 1;
  //     padding-right: 0.5rem;

  //     > div.chain {
  //       font-size: 0.9rem;
  //       line-height: 1rem;
  //     }

  //     > div.runtimeVersion {
  //       font-size: 0.75rem;
  //       line-height: 1rem;
  //     }
  //   }
  // }
`);
