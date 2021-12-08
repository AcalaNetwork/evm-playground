import { ApiPromise } from '@polkadot/api/promise';
import type { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types';
import type { InjectedExtension } from '@polkadot/extension-inject/types';

export interface ApiState {
    apiDefaultTx: SubmittableExtrinsicFunction;
    apiDefaultTxSudo: SubmittableExtrinsicFunction;
    hasInjectedAccounts: boolean;
    isApiReady: boolean;
    isDevelopment: boolean;
    systemChain: string;
    systemName: string;
    systemVersion: string;
}

export interface ApiProps extends ApiState {
    api: ApiPromise;
    apiError: string | null;
    extensions?: InjectedExtension[];
    isReady: boolean;
    isApiConnected: boolean;
    isApiInitialized: boolean;
    isWaitingInjected: boolean;
    loadExtension: () => Promise<void>;
    isLoaded: boolean;
    isExtensionLoading: boolean;
}
