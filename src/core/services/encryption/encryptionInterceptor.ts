import {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  encryptionService,
  EncryptionResult,
} from '@/core/services/encryption/encryptionService';
import { shouldEncryptMethod } from '@/core/services/encryption/encryptionConfig';
import { shouldEncryptEndpoint } from '@/core/constant/encryptionEndpoints'; // ✅ Correct import

interface EncryptedRequestData {
  encryptedValue: string; // HEX_ENCRYPTED_AES_PAYLOAD
  encryptedKey: string; // HEX_RSA_ENCRYPTED_AES_KEY
  iv: string; // HEX_IV
  originalData?: any; // Optional: remove in production
}

interface EncryptedResponseData {
  encryptedValue: string; // HEX_ENCRYPTED_AES_PAYLOAD (from server)
  success?: boolean;
  message?: string;
}

// Store AES keys and IVs for decrypting responses
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

    // Other control flags
    const headerSkipEncryption =
      config.headers?.['X-Skip-Encryption'] === 'true';
    const configSkipEncryption = (config as any).skipEncryption === true;

    if (
      !shouldEncrypt ||
      headerSkipEncryption ||
      configSkipEncryption ||
      !encryptionService.isEncryptionEnabled()
    ) {
      return config;
    }

    // For GET requests that need encrypted responses, generate AES key and IV for headers
    if (method === 'get') {
      // Generate AES key and IV for encrypted response
      const aesKey = encryptionService.generateAESKey();
      const iv = encryptionService.generateIV();

      // Ensure RSA public key is available
      await encryptionService.ensureRSAPublicKey();

      // Encrypt the AES key with RSA
      const encryptedAESKey = encryptionService.encryptAESKeyWithRSA(aesKey);

      // Store encryption context for response decryption
      const contextKey = `${url}_${Date.now()}`;
      encryptionContext.set(contextKey, {
        aesKey,
        iv,
      });

      (config as any).encryptionContextKey = contextKey;

      // Add encryption headers for GET requests
      if (config.headers) {
        config.headers['x-encrypted-key'] = encryptedAESKey;
        config.headers['x-iv'] = iv;
      }

      return config;
    }

    // For other methods (POST, PUT, PATCH), encrypt the request body
    if (!shouldEncryptMethod(method) || !config.data) {
      return config;
    }

    const encryptionResult: EncryptionResult =
      await encryptionService.encryptPayload(config.data);

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
    return config; // fallback to original config if encryption fails
  }
};

/**
 * Response interceptor to decrypt incoming data
 */
export const decryptResponseInterceptor = (
  response: AxiosResponse
): AxiosResponse => {
  try {
    if (!encryptionService.isEncryptionEnabled()) {
      return response;
    }

    const responseData = response.data as EncryptedResponseData;

    if (
      !responseData ||
      typeof responseData !== 'object' ||
      !responseData.encryptedValue
    ) {
      return response;
    }

    const contextKey = (response.config as any).encryptionContextKey;

    if (!contextKey) {
      console.warn('No encryption context key found for response');
      return response;
    }

    const encryptionCtx = encryptionContext.get(contextKey);
    if (!encryptionCtx) {
      console.warn('Encryption context not found for key:', contextKey);
      return response;
    }

    const decryptedData = encryptionService.decryptResponse({
      encryptedData: responseData.encryptedValue,
      aesKey: encryptionCtx.aesKey,
      iv: encryptionCtx.iv,
    });

    encryptionContext.delete(contextKey);

    response.data = {
      ...responseData,
      ...decryptedData,
      encryptedValue: undefined,
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
