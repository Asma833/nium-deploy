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
  aesKey?: string; // Raw AES key (not recommended for production)
  encryptedKey?: string; // RSA encrypted AES key
  iv?: string;
  authTag?: string;
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

    console.log('🔐 Request encryption check:', {
      url,
      method,
      shouldEncrypt,
      headerSkipEncryption,
      configSkipEncryption,
      encryptionEnabled: encryptionService.isEncryptionEnabled(),
      hasData: !!config.data
    });

    if (!shouldEncrypt || headerSkipEncryption || configSkipEncryption || !encryptionService.isEncryptionEnabled()) {
      console.log('🔐 Skipping encryption for:', url);
      return config;
    }

    // Generate encryption keys for all encrypted requests
    const aesKey = encryptionService.generateAESKey();
    const iv = encryptionService.generateIV();

    await encryptionService.ensureRSAPublicKey();

    const encryptedAESKey = encryptionService.encryptAESKeyWithRSA(aesKey);

    // Always send encryption headers for encrypted requests
    if (config.headers) {
      config.headers['x-encrypted-key'] = encryptedAESKey;
      config.headers['x-iv'] = iv;
    }

    if (method === 'get' || method === 'delete') {
      // For GET/DELETE, we need to store the SAME aesKey and iv that we sent in headers
      // Backend will use these header values to encrypt the response
      const contextKey = `${url}_${Date.now()}`;
      
      // Generate auth tag from fixed data using the SAME aesKey and iv
      const fixedData = 'GET_REQUEST';
      const { authTag } = await encryptionService.encryptWithAES(fixedData, aesKey, iv);
      
      encryptionContext.set(contextKey, {
        aesKey: aesKey, // Use the SAME aesKey we sent in headers
        iv: iv,         // Use the SAME iv we sent in headers
        authTag: authTag,
      });
      (config as any).encryptionContextKey = contextKey;

      if (config.headers) {
        config.headers['x-auth-tag'] = authTag;
      }

      console.log('🔐 GET request encryption context stored:', {
        aesKeyLength: aesKey.length,
        ivLength: iv.length,
        authTagLength: authTag.length
      });

      return config;
    }

    if (!shouldEncryptMethod(method) || !config.data) {
      return config;
    }

    // For POST/PUT/PATCH, encrypt the data and send both headers and encrypted body
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
      config.headers['x-auth-tag'] = encryptionResult.authTag;
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
      console.log('🔐 Encryption disabled, skipping decryption');
      return response;
    }

    const responseData = response.data as EncryptedResponseData;

    console.log('🔐 Response decryption check:', {
      url: response.config.url,
      hasEncryptedData: !!(responseData && responseData.encryptedData),
      responseDataKeys: responseData ? Object.keys(responseData) : [],
      fullResponseData: responseData
    });

    if (!responseData || typeof responseData !== 'object' || !responseData.encryptedData) {
      console.log('🔐 No encrypted data found, returning response as-is');
      return response;
    }

    const contextKey = (response.config as any).encryptionContextKey;

    if (!contextKey) {
      console.warn('🔐 No encryption context key found in request config');
      encryptionLogger.logContextMissing('encryptionContextKey');
      return response;
    }

    const encryptionCtx = encryptionContext.get(contextKey);
    if (!encryptionCtx) {
      console.warn('🔐 No encryption context found for key:', contextKey);
      encryptionLogger.logContextMissing(contextKey);
      return response;
    }

    console.log('🔐 Encryption context found:', {
      contextKey,
      hasAesKey: !!encryptionCtx.aesKey,
      contextAesKeyLength: encryptionCtx.aesKey?.length,
      hasIv: !!encryptionCtx.iv,
      contextIvLength: encryptionCtx.iv?.length,
      hasAuthTag: !!encryptionCtx.authTag,
      contextAuthTagLength: encryptionCtx.authTag?.length
    });

    // Determine which AES key to use for decryption
    // Priority: 1. Backend's raw aesKey, 2. Decrypt encryptedKey, 3. Request context aesKey
    let aesKeyToUse: string;
    let ivToUse: string;
    let authTagToUse: string;

    console.log('🔐 Response data structure:', {
      hasAesKey: !!responseData.aesKey,
      aesKeyPreview: responseData.aesKey?.substring(0, 10),
      hasEncryptedKey: !!responseData.encryptedKey,
      encryptedKeyPreview: responseData.encryptedKey?.substring(0, 20),
      hasIv: !!responseData.iv,
      ivValue: responseData.iv,
      hasAuthTag: !!responseData.authTag,
      authTagValue: responseData.authTag,
      encryptedDataLength: responseData.encryptedData?.length
    });

    // IMPORTANT: Backend encrypts response with the SAME AES key from the request
    // So we should use the request context key, NOT a new key from response
    if (responseData.aesKey) {
      // Backend provided raw AES key (use this if available)
      console.log('🔐 Using raw AES key from backend response');
      aesKeyToUse = responseData.aesKey;
      // IMPORTANT: Always use request context IV - backend should encrypt with the same IV we sent
      ivToUse = encryptionCtx.iv;
      authTagToUse = responseData.authTag || encryptionCtx.authTag;
    } else if (responseData.encryptedKey) {
      // Try to decrypt the RSA-encrypted AES key
      console.log('🔐 Attempting to decrypt RSA-encrypted AES key...');
      const decryptedKey = await encryptionService.decryptAESKeyWithRSA(responseData.encryptedKey);
      
      if (decryptedKey) {
        console.log('🔐 Successfully decrypted AES key from encryptedKey');
        aesKeyToUse = decryptedKey;
        // IMPORTANT: Always use request context IV - backend should encrypt with the same IV we sent
        ivToUse = encryptionCtx.iv;
        authTagToUse = responseData.authTag || encryptionCtx.authTag;
      } else if (encryptionCtx.aesKey) {
        // Fallback to request context key
        console.log('🔐 Could not decrypt encryptedKey, using request context key');
        aesKeyToUse = encryptionCtx.aesKey;
        // IMPORTANT: Always use request context IV - backend should encrypt with the same IV we sent
        ivToUse = encryptionCtx.iv;
        authTagToUse = responseData.authTag || encryptionCtx.authTag;
      } else {
        const errorMsg = 'Cannot decrypt RSA-encrypted key (no private key in frontend) and no request context key available. Backend must send raw "aesKey" field.';
        console.error('🔐 Decryption error:', errorMsg);
        encryptionLogger.error(errorMsg, new Error('Missing AES key'));
        throw new Error(errorMsg);
      }
    } else if (encryptionCtx.aesKey) {
      // Use AES key from request context (this is the normal flow)
      // Backend encrypts response with the same key and IV we sent in the request
      console.log('🔐 Using AES key and IV from request context (backend reuses request key and IV)');
      aesKeyToUse = encryptionCtx.aesKey;
      // IMPORTANT: Always use request context IV - backend should encrypt with the same IV we sent
      ivToUse = encryptionCtx.iv;
      authTagToUse = responseData.authTag || encryptionCtx.authTag;
    } else {
      // No AES key available - cannot decrypt
      const errorMsg = 'No AES key available for decryption. Backend must include "aesKey" in encrypted responses or reuse request key.';
      console.error('🔐 Decryption error:', errorMsg);
      console.error('🔐 Available data:', {
        responseDataKeys: Object.keys(responseData),
        contextKeys: Object.keys(encryptionCtx)
      });
      encryptionLogger.error(errorMsg, new Error('Missing AES key'));
      throw new Error(errorMsg);
    }

    // Validate all required decryption parameters
    if (!aesKeyToUse || !ivToUse || !authTagToUse) {
      const errorMsg = `Missing required decryption parameters: ${!aesKeyToUse ? 'aesKey ' : ''}${!ivToUse ? 'iv ' : ''}${!authTagToUse ? 'authTag' : ''}`;
      console.error('🔐 Decryption error:', errorMsg);
      throw new Error(errorMsg);
    }

    console.log('🔐 Final decryption parameters:', {
      source: responseData.aesKey ? 'backend response' : 'request context',
      aesKeyPreview: aesKeyToUse.substring(0, 10) + '...',
      aesKeyLength: aesKeyToUse.length,
      ivValue: ivToUse,
      ivLength: ivToUse.length,
      authTagValue: authTagToUse,
      authTagLength: authTagToUse.length,
      encryptedDataLength: responseData.encryptedData.length,
      encryptedDataPreview: responseData.encryptedData.substring(0, 50) + '...'
    });

    const decryptedData = await encryptionService.decryptResponse({
      encryptedData: responseData.encryptedData,
      aesKey: aesKeyToUse,
      iv: ivToUse,
      authTag: authTagToUse,
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
