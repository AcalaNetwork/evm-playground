import React from 'react';
import type { ApiProps } from './types';

const ApiContext: React.Context<ApiProps> = React.createContext(
    ({} as unknown) as ApiProps
);
const ApiConsumer: React.Consumer<ApiProps> = ApiContext.Consumer;
const ApiProvider: React.Provider<ApiProps> = ApiContext.Provider;

export { ApiContext, ApiConsumer, ApiProvider };
