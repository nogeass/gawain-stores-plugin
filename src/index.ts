/**
 * gawain-stores-plugin
 * STORES plugin for Gawain video generation API
 */

// Re-export main modules
export { GawainClient, createConfigFromEnv, type GawainClientConfig } from './gawain/client.js';
export {
  type ProductInput,
  type CreateJobRequest,
  type CreateJobResponse,
  type GetJobResponse,
  type JobStatus,
  GawainApiError,
} from './gawain/types.js';

export {
  getOrCreateInstallId,
  generateInstallId,
  readInstallId,
  writeInstallId,
  buildUpgradeUrl,
} from './install/install_id.js';

export {
  convertStoresProduct,
  validateStoresProduct,
  type StoresProduct,
  type StoresProductImage,
  type StoresProductVariant,
  type StoresPriceContext,
} from './platform/stores_adapter.js';

export { loadEnvConfig, maskSecret, type EnvConfig } from './util/env.js';
export { withRetry, sleep, isRetryableError, type RetryOptions } from './util/retry.js';
