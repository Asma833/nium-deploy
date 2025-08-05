// Core encryption service
export { encryptionService } from './encryptionService';
export type { EncryptionResult, DecryptionParams, ApiEncryptionPayload } from './encryptionService';

// Axios interceptors
export { encryptRequestInterceptor, decryptResponseInterceptor, EncryptedApiClient } from './encryptionInterceptor';

// React hook
export { useEncryption } from '@/hooks/useEncryption';

// Re-export the default export
export { encryptionService as default } from './encryptionService';
