import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { encryptionService, EncryptionResult } from '@/core/services/encryption/encryptionService';
import { shouldEncryptMethod } from '@/core/services/encryption/encryptionConfig';
import { shouldEncryptEndpoint } from '@/core/constant/encryptionEndpoints';
import encryptionLogger from './encryptionLogger';

interface EncryptedRequestData {
  encryptedValue: string;
  encryptedKey: string;
  iv: string;
  originalData?: any;
}

interface EncryptedResponseData {
  encryptedValue: string;
  success?: boolean;
  message?: string;
}

const encryptionContext = new Map<string, { aesKey: string; iv: string }>();

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

    if (method === 'get') {
      const aesKey = encryptionService.generateAESKey();
      const iv = encryptionService.generateIV();

      await encryptionService.ensureRSAPublicKey();

      const encryptedAESKey = encryptionService.encryptAESKeyWithRSA(aesKey);

      const contextKey = `${url}_${Date.now()}`;
      encryptionContext.set(contextKey, { aesKey, iv });
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
    });

    (config as any).encryptionContextKey = contextKey;

    const encryptedPayload: EncryptedRequestData = {
      encryptedValue: encryptionResult.encryptedData,
      encryptedKey: encryptionResult.encryptedAESKey,
      iv: encryptionResult.iv,
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
export const decryptResponseInterceptor = (response: AxiosResponse): AxiosResponse => {
  try {
    if (!encryptionService.isEncryptionEnabled()) {
      return response;
    }

    const responseData = response.data as EncryptedResponseData;

    if (!responseData || typeof responseData !== 'object' || !responseData.encryptedValue) {
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

    const decryptedData = encryptionService.decryptResponse({
      encryptedData: responseData.encryptedValue,
      aesKey: encryptionCtx.aesKey,
      iv: encryptionCtx.iv,
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

    return {
      encryptedValue: result.encryptedData,
      encryptedKey: result.encryptedAESKey,
      iv: result.iv,
    };
  }

  decryptResponse(encryptedData: string): any {
    if (!this.aesKey || !this.iv) {
      throw new Error('No encryption context available for decryption');
    }

    const result = encryptionService.decryptResponse({
      encryptedData,
      aesKey: this.aesKey,
      iv: this.iv,
    });

    this.clearContext();
    return result;
  }

  clearContext(): void {
    this.aesKey = null;
    this.iv = null;
  }
}

export default {
  encryptRequestInterceptor,
  decryptResponseInterceptor,
  EncryptedApiClient,
};
