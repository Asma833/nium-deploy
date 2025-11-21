import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { encryptionService, EncryptionResult } from '@/core/services/encryption/encryptionService';
import { shouldEncryptMethod } from '@/core/services/encryption/encryptionConfig';
import { shouldEncryptEndpoint } from '@/core/constant/encryptionEndpoints';
import encryptionLogger from './encryptionLogger';

interface EncryptedRequestData {
  encryptedData: string;
  encryptedKey: string;
  iv: string;
  authTag: string;
  originalData?: any;
}

interface EncryptedResponseData {
  encryptedData: string;
  success?: boolean;
  message?: string;
}

const encryptionContext = new Map<string, { aesKey: string; iv: string; authTag: string }>();

/**
 * Request interceptor to encrypt outgoing data
 */
export const encryptRequestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  try {
    const url = config.url || '';
    const method = config.method?.toLowerCase() || '';
    const shouldEncrypt = shouldEncryptEndpoint(url);

    const headerSkipEncryption = config.headers?.['X-Skip-Encryption'] === 'true';
    const configSkipEncryption = (config as any).skipEncryption === true;

    if (!shouldEncrypt || headerSkipEncryption || configSkipEncryption || !encryptionService.isEncryptionEnabled()) {
      return config;
    }

    if (method === 'get' || method === 'delete') {
      const aesKey = encryptionService.generateAESKey();
      const iv = encryptionService.generateIV();

      await encryptionService.ensureRSAPublicKey();

      const encryptedAESKey = encryptionService.encryptAESKeyWithRSA(aesKey);

      const contextKey = `${url}_${Date.now()}`;
      encryptionContext.set(contextKey, { aesKey, iv, authTag: '' });
      (config as any).encryptionContextKey = contextKey;

      if (config.headers) {
        config.headers['x-encrypted-key'] = encryptedAESKey;
        config.headers['x-iv'] = iv;
      }

      return config;
    }

    if (!shouldEncryptMethod(method) || !config.data) {
      return config;
    }

    const encryptionResult: EncryptionResult = await encryptionService.encryptPayload(config.data);

    const contextKey = `${url}_${Date.now()}`;
    encryptionContext.set(contextKey, {
      aesKey: encryptionResult.aesKey,
      iv: encryptionResult.iv,
      authTag: encryptionResult.authTag,
    });

    (config as any).encryptionContextKey = contextKey;

    const encryptedPayload: EncryptedRequestData = {
      encryptedData: encryptionResult.encryptedData,
      encryptedKey: encryptionResult.encryptedKey,
      iv: encryptionResult.iv,
      authTag: encryptionResult.authTag,
    };

    config.data = encryptedPayload;

    if (config.headers) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  } catch (error) {
    console.error('Error in request encryption interceptor:', error);
    return config;
  }
};

/**
  * Response interceptor to decrypt incoming data
  */
export const decryptResponseInterceptor = async (response: AxiosResponse): Promise<AxiosResponse> => {
  try {
    if (!encryptionService.isEncryptionEnabled()) {
      return response;
    }

    const responseData = response.data as EncryptedResponseData;

    if (!responseData || typeof responseData !== 'object' || !responseData.encryptedData) {
      return response;
    }

    const contextKey = (response.config as any).encryptionContextKey;

    if (!contextKey) {
      encryptionLogger.logContextMissing('encryptionContextKey');
      return response;
    }

    const encryptionCtx = encryptionContext.get(contextKey);
    if (!encryptionCtx) {
      encryptionLogger.logContextMissing(contextKey);
      return response;
    }

    const decryptedData = await encryptionService.decryptResponse({
      encryptedData: responseData.encryptedData,
      aesKey: encryptionCtx.aesKey,
      iv: encryptionCtx.iv,
      authTag: encryptionCtx.authTag,
    });

    encryptionContext.delete(contextKey);

    // ✅ Log decrypted response data
    encryptionLogger.logApiResponse(response.config.url || '', decryptedData, response.status);

    response.data = {
      ...decryptedData,
    };

    return response;
  } catch (error) {
    console.error('Error in response decryption interceptor:', error);
    return response;
  }
};

/**
 * Optional: Class for manual encryption in custom use cases
 */
export class EncryptedApiClient {
  private static instance: EncryptedApiClient;
  private aesKey: string | null = null;
  private iv: string | null = null;
  private authTag: string | null = null;

  static getInstance(): EncryptedApiClient {
    if (!EncryptedApiClient.instance) {
      EncryptedApiClient.instance = new EncryptedApiClient();
    }
    return EncryptedApiClient.instance;
  }

  async encryptRequest(data: any): Promise<EncryptedRequestData> {
    const result = await encryptionService.encryptPayload(data);

    this.aesKey = result.aesKey;
    this.iv = result.iv;
    this.authTag = result.authTag;

    return {
      encryptedData: result.encryptedData,
      encryptedKey: result.encryptedKey,
      iv: result.iv,
      authTag: result.authTag,
    };
  }

  async decryptResponse(encryptedData: string): Promise<any> {
    if (!this.aesKey || !this.iv || !this.authTag) {
      throw new Error('No encryption context available for decryption');
    }

    const result = await encryptionService.decryptResponse({
      encryptedData,
      aesKey: this.aesKey,
      iv: this.iv,
      authTag: this.authTag,
    });

    this.clearContext();
    return result;
  }

  clearContext(): void {
    this.aesKey = null;
    this.iv = null;
    this.authTag = null;
  }
}

export default {
  encryptRequestInterceptor,
  decryptResponseInterceptor,
  EncryptedApiClient,
};
