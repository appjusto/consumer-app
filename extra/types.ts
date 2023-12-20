import { Environment } from '@appjusto/types';

export interface AlgoliaConfig {
  appId: string;
  apiKey: string;
}
export interface Extra {
  env: Environment;
  firebase: {
    region: string;
    emulator: {
      host?: string;
    };
  };
  algolia: AlgoliaConfig;
  iugu: {
    accountId: string;
  };
  eas: {
    projectId: string;
  };
}
