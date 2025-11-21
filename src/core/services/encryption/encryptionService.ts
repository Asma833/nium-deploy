import CryptoJS from 'crypto-js';
import * as forge from 'node-forge';
import { encryptionLogger } from './encryptionLogger';

export interface EncryptionResult {
  encryptedData: string;
  encryptedKey: string; // RSA encrypted AES key
  iv: string;
  authTag: string;
  aesKey: string; // Include the AES key for response decryption
}

export interface ApiEncryptionPayload {
  encryptedData: string; // HEX_ENCRYPTED_AES_PAYLOAD
  encryptedKey: string; // HEX_RSA_ENCRYPTED_AES_KEY
  iv: string; // HEX_IV
  authTag: string; // GCM authentication tag
}

export interface DecryptionParams {
  encryptedData: string;
  aesKey: string;
  iv: string;
  authTag: string;
}

class EncryptionService {
  private rsaPublicKey: string | null = null;

  /**
   * Get RSA key source configuration
   */
  private getRSAKeySource(): 'api' | 'env' {
    const source = import.meta.env.VITE_RSA_KEY_SOURCE?.toLowerCase();
    return source === 'api' ? 'api' : 'env'; // Default to 'env' if not specified
  }

  /**
   * Get RSA public key from environment variables
   */
  private getRSAPublicKeyFromEnv(): string {
    const envKey = import.meta.env.VITE_RSA_PUBLIC_KEY;
    if (!envKey) {
      throw new Error('RSA public key not found in environment variables (VITE_RSA_PUBLIC_KEY)');
    }
    return envKey;
  }

  /**
   * Fetch RSA public key from server
   */
  async fetchRSAPublicKey(): Promise<string> {
    try {
      const endpoint = import.meta.env.VITE_RSA_PUBLIC_KEY_ENDPOINT;
      const baseURL = import.meta.env.VITE_APP_API_URL;

      if (!endpoint || !baseURL) {
        throw new Error('RSA public key endpoint or base URL not configured');
      }

      const response = await fetch(`${baseURL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch RSA public key: ${response.status}`);
      }
      const data = await response.json();
      this.rsaPublicKey = data.publicKey || data.public_key || data;

      if (!this.rsaPublicKey) {
        throw new Error('Invalid RSA public key received from server');
      }
      return this.rsaPublicKey;
    } catch (error) {
      encryptionLogger.error('Failed to fetch RSA public key', error as Error);
      throw new Error('Failed to fetch RSA public key');
    }
  }

  /**
   * Get RSA public key based on configuration
   * Returns cached key if available, otherwise fetches from configured source
   */
  async ensureRSAPublicKey(): Promise<string> {
    // Return cached key if available
    if (this.rsaPublicKey) {
      return this.rsaPublicKey;
    }

    const keySource = this.getRSAKeySource();

    try {
      if (keySource === 'env') {
        // Get key from environment variables
        this.rsaPublicKey = this.getRSAPublicKeyFromEnv();
        encryptionLogger.logRSAKeyLoaded('env');
      } else {
        // Fetch key from API
        await this.fetchRSAPublicKey();
        encryptionLogger.logRSAKeyLoaded('api');
      }
      return this.rsaPublicKey!;
    } catch (error) {
      encryptionLogger.error(`Failed to get RSA public key from ${keySource}`, error as Error);

      // Fallback mechanism: try the other source if the primary fails
      try {
        if (keySource === 'env') {
          encryptionLogger.info('Falling back to API endpoint...');
          await this.fetchRSAPublicKey();
          encryptionLogger.logRSAKeyLoaded('api', true);
        } else {
          encryptionLogger.info('Falling back to environment variables...');
          this.rsaPublicKey = this.getRSAPublicKeyFromEnv();
          encryptionLogger.logRSAKeyLoaded('env', true);
        }

        return this.rsaPublicKey!;
      } catch (fallbackError) {
        encryptionLogger.error('Fallback also failed', fallbackError as Error);
        throw new Error(`Failed to get RSA public key from both ${keySource} and fallback source`);
      }
    }
  }

  /**
   * Generate a secure random AES key (16 bytes for AES-128)
   */
  generateAESKey(): string {
    // Generate 16 bytes (128 bits) for AES-128
    const keyBytes = new Uint8Array(16);
    crypto.getRandomValues(keyBytes);
    return this.uint8ArrayToHex(keyBytes);
  }

  /**
   * Generate a secure random IV (12 bytes for AES-GCM)
   */
  generateIV(): string {
    // Generate 12 bytes (96 bits) for GCM
    const ivBytes = new Uint8Array(12);
    crypto.getRandomValues(ivBytes);
    return this.uint8ArrayToHex(ivBytes);
  }

  /**
   * Convert hex string to Uint8Array
   */
  private hexToUint8Array(hex: string): Uint8Array {
    return new Uint8Array(hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []);
  }

  /**
   * Convert Uint8Array to hex string
   */
  private uint8ArrayToHex(array: Uint8Array): string {
    return Array.from(array)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Encrypt data using AES-128-GCM
   */
  async encryptWithAES(data: any, aesKey: string, iv: string): Promise<{ encryptedData: string; authTag: string }> {
    try {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      const encodedData = new TextEncoder().encode(dataString);

      // Import the key
      const keyData = this.hexToUint8Array(aesKey);
      const key = await crypto.subtle.importKey('raw', keyData as any, { name: 'AES-GCM', length: 128 }, false, [
        'encrypt',
      ]);

      // Encrypt with AES-GCM
      const ivData = this.hexToUint8Array(iv);
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: ivData as any,
        },
        key,
        encodedData
      );

      // Web Crypto API returns ciphertext + auth tag concatenated
      // Extract them separately to match backend format
      const encryptedArray = new Uint8Array(encrypted);
      const authTagLength = 16; // 16 bytes for GCM auth tag
      const ciphertext = encryptedArray.slice(0, encryptedArray.length - authTagLength);
      const authTag = encryptedArray.slice(encryptedArray.length - authTagLength);

      const result = {
        encryptedData: this.uint8ArrayToHex(ciphertext),
        authTag: this.uint8ArrayToHex(authTag),
      };

      return result;
    } catch (error) {
      encryptionLogger.error('AES-GCM encryption error', error as Error);
      throw new Error('Failed to encrypt data with AES-GCM');
    }
  }

  /**
   * Decrypt data using AES-128-GCM
   */
  async decryptWithAES(encryptedData: string, aesKey: string, iv: string, authTag: string): Promise<string> {
    try {
      // Validate input parameters
      if (!encryptedData || !aesKey || !iv || !authTag) {
        throw new Error(
          `Missing required parameters: ${!encryptedData ? 'encryptedData ' : ''}${!aesKey ? 'aesKey ' : ''}${!iv ? 'iv ' : ''}${!authTag ? 'authTag' : ''}`
        );
      }

      // Validate hex string format
      const hexRegex = /^[0-9a-fA-F]+$/;
      if (!hexRegex.test(encryptedData)) {
        throw new Error('Invalid encryptedData format - must be hex string');
      }
      if (!hexRegex.test(aesKey)) {
        throw new Error('Invalid aesKey format - must be hex string');
      }
      if (!hexRegex.test(iv)) {
        throw new Error('Invalid iv format - must be hex string');
      }
      if (!hexRegex.test(authTag)) {
        throw new Error('Invalid authTag format - must be hex string');
      }

      // Validate key and IV lengths
      if (aesKey.length !== 32) {
        // 16 bytes = 32 hex chars for AES-128
        throw new Error(`Invalid AES key length: expected 32 hex chars (16 bytes), got ${aesKey.length}`);
      }
      if (iv.length !== 24) {
        // 12 bytes = 24 hex chars for GCM IV
        throw new Error(`Invalid IV length: expected 24 hex chars (12 bytes), got ${iv.length}`);
      }
      if (authTag.length !== 32) {
        // 16 bytes = 32 hex chars for GCM auth tag
        throw new Error(`Invalid auth tag length: expected 32 hex chars (16 bytes), got ${authTag.length}`);
      }

      // For Web Crypto API GCM, we need ciphertext + auth tag concatenated
      // The backend sends them separately, so we combine them
      const ciphertext = this.hexToUint8Array(encryptedData);
      const tag = this.hexToUint8Array(authTag);
      const combined = new Uint8Array(ciphertext.length + tag.length);
      combined.set(ciphertext);
      combined.set(tag, ciphertext.length);

      // Import the key
      const keyData = this.hexToUint8Array(aesKey);
      const key = await crypto.subtle.importKey('raw', keyData as any, { name: 'AES-GCM', length: 128 }, false, [
        'decrypt',
      ]);

      // Decrypt with AES-GCM - let Web Crypto API handle the auth tag
      const ivData = this.hexToUint8Array(iv);
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivData as any,
          tagLength: 128, // 16 bytes = 128 bits auth tag
        },
        key,
        combined
      );

      const decryptedString = new TextDecoder().decode(decrypted);

      if (!decryptedString) {
        throw new Error('Decryption produced empty result');
      }
      return decryptedString;
    } catch (error) {
      // Provide detailed error information for debugging
      const errorDetails = {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        encryptedDataPreview: encryptedData.substring(0, 50) + '...',
        encryptedDataLength: encryptedData.length,
        aesKeyPreview: aesKey.substring(0, 10) + '...',
        aesKeyLength: aesKey.length,
        iv,
        ivLength: iv.length,
        authTag,
        authTagLength: authTag.length,
      };

      console.error('Decryption error details:', errorDetails);
      encryptionLogger.error('AES-GCM decryption error', error as Error);

      // Provide helpful error message based on error type
      if (error instanceof Error && error.message.includes('OperationError')) {
        throw new Error(
          'AES-GCM decryption failed: Authentication tag verification failed. This usually means the key, IV, or data is incorrect.'
        );
      }

      throw new Error(
        `Failed to decrypt data with AES-GCM: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Encrypt AES key using RSA-2048 with OAEP padding
   */
  encryptAESKeyWithRSA(aesKey: string, rsaPublicKey?: string): string {
    try {
      const publicKey = rsaPublicKey || this.rsaPublicKey;

      if (!publicKey) {
        throw new Error('RSA public key not available');
      }

      // Parse the PEM public key
      const forgePublicKey = forge.pki.publicKeyFromPem(publicKey);

      // Convert hex AES key to bytes
      const aesKeyBytes = forge.util.hexToBytes(aesKey);

      // Encrypt using RSA-OAEP
      const encrypted = forgePublicKey.encrypt(aesKeyBytes, 'RSA-OAEP'); // Return as HEX instead of Base64 (backend expects HEX format)
      return forge.util.bytesToHex(encrypted);
    } catch (error) {
      encryptionLogger.error('RSA encryption error', error as Error);
      throw new Error('Failed to encrypt AES key with RSA');
    }
  }

  /**
   * Complete encryption process:
   * 1. Generate AES key and IV
   * 2. Encrypt data with AES
   * 3. Encrypt AES key with RSA
   */
  async encryptPayload(data: any): Promise<EncryptionResult> {
    try {
      // Check if encryption is enabled
      const encryptionEnabled = import.meta.env.VITE_ENABLE_ENCRYPTION === 'true';
      if (!encryptionEnabled) {
        // Return data as-is if encryption is disabled
        return {
          encryptedData: typeof data === 'string' ? data : JSON.stringify(data),
          encryptedKey: '',
          iv: '',
          authTag: '',
          aesKey: '',
        };
      }

      // Ensure we have the RSA public key
      const rsaPublicKey = await this.ensureRSAPublicKey();

      // Generate AES key and IV
      const aesKey = this.generateAESKey();
      const iv = this.generateIV();

      // Encrypt the data with AES
      const encryptionResult = await this.encryptWithAES(data, aesKey, iv);

      // Encrypt the AES key with RSA
      const encryptedAESKey = this.encryptAESKeyWithRSA(aesKey, rsaPublicKey);

      return {
        encryptedData: encryptionResult.encryptedData,
        encryptedKey: encryptedAESKey,
        iv,
        authTag: encryptionResult.authTag,
        aesKey, // Include the AES key for response decryption
      };
    } catch (error) {
      encryptionLogger.error('Encryption process error', error as Error);
      throw new Error('Failed to encrypt payload');
    }
  }

  /**
   * Decrypt response data using stored AES key and IV
   */
  async decryptResponse(params: DecryptionParams): Promise<any> {
    try {
      const encryptionEnabled = import.meta.env.VITE_ENABLE_ENCRYPTION === 'true';

      if (!encryptionEnabled) {
        // Return data as-is if encryption is disabled
        try {
          return JSON.parse(params.encryptedData);
        } catch {
          return params.encryptedData;
        }
      }

      const decryptedString = await this.decryptWithAES(params.encryptedData, params.aesKey, params.iv, params.authTag);

      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(decryptedString);
      } catch {
        return decryptedString;
      }
    } catch (error) {
      encryptionLogger.error('Decryption process error', error as Error);
      throw new Error('Failed to decrypt response');
    }
  }

  /**
   * Check if encryption is enabled
   */
  isEncryptionEnabled(): boolean {
    return import.meta.env.VITE_ENABLE_ENCRYPTION === 'true';
  }

  /**
   * Get current encryption configuration
   */
  getEncryptionConfig() {
    return {
      encryptionEnabled: this.isEncryptionEnabled(),
      rsaKeySource: this.getRSAKeySource(),
      hasRsaKeyInEnv: !!import.meta.env.VITE_RSA_PUBLIC_KEY,
      hasRsaEndpoint: !!import.meta.env.VITE_RSA_PUBLIC_KEY_ENDPOINT,
      hasCachedKey: !!this.rsaPublicKey,
    };
  }

  /**
   * Reset cached RSA key (useful for testing or switching sources)
   */
  resetRSAKey(): void {
    this.rsaPublicKey = null;
  }

  /**
   * Get current RSA public key (synchronous, returns cached value)
   */
  getRSAPublicKey(): string | null {
    return this.rsaPublicKey;
  }

  /**
   * Set RSA public key manually
   */
  setRSAPublicKey(publicKey: string): void {
    this.rsaPublicKey = publicKey;
  }

  /**
   * Decrypt RSA-encrypted AES key using private key (if available)
   * NOTE: This should only be used for testing. In production, backend should send raw aesKey.
   */
  async decryptAESKeyWithRSA(encryptedKey: string): Promise<string | null> {
    try {
      // Check if private key is available in environment (NOT RECOMMENDED for production)
      const privateKey = import.meta.env.VITE_RSA_PRIVATE_KEY;

      if (!privateKey) {
        return null;
      }

      // Use node-forge to decrypt
      const forgePrivateKey = forge.pki.privateKeyFromPem(privateKey);

      // Convert hex to bytes
      const encryptedBytes = forge.util.hexToBytes(encryptedKey);

      // Decrypt using RSA-OAEP
      const decryptedBytes = forgePrivateKey.decrypt(encryptedBytes, 'RSA-OAEP');

      // Convert bytes to hex
      const aesKeyHex = forge.util.bytesToHex(decryptedBytes);

      return aesKeyHex;
    } catch (error) {
      return null;
    }
  }
}

// Export singleton instance
export const encryptionService = new EncryptionService();
export default encryptionService;
