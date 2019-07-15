export interface HttpEntityServiceConfig {
  baseApi: string;
  name: string;
}

export function HttpClientEntityConfig(config: Partial<HttpEntityServiceConfig>) {
  return constructor => {
    if (config.baseApi) {
      constructor['baseApi'] = config.baseApi;
    }
    if (config.name) {
      constructor['name'] = config.baseApi;
    }
  };
}
