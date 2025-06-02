import CryptoJS from 'crypto-js';
import * as forge from 'node-forge';

export interface EncryptionResult {
  encryptedData: string;
  encryptedAESKey: string;
  iv: string;
  aesKey: string; // Include the AES key for response decryption
}

export interface ApiEncryptionPayload {
  encryptedValue: string; // HEX_ENCRYPTED_AES_PAYLOAD
  encryptedKey: string; // HEX_RSA_ENCRYPTED_AES_KEY
  iv: string; // HEX_IV
}

export interface DecryptionParams {
  encryptedData: string;
  aesKey: string;
  iv: string;
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
      throw new Error(
        'RSA public key not found in environment variables (VITE_RSA_PUBLIC_KEY)'
      );
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
      console.error('Error fetching RSA public key:', error);
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
        console.log('RSA public key loaded from environment variables');
      } else {
        // Fetch key from API
        await this.fetchRSAPublicKey();
        console.log('RSA public key fetched from API endpoint');
      }

      return this.rsaPublicKey!;
    } catch (error) {
      console.error(`Failed to get RSA public key from ${keySource}:`, error);

      // Fallback mechanism: try the other source if the primary fails
      try {
        if (keySource === 'env') {
          console.log('Falling back to API endpoint...');
          await this.fetchRSAPublicKey();
          console.log('RSA public key fetched from API endpoint (fallback)');
        } else {
          console.log('Falling back to environment variables...');
          this.rsaPublicKey = this.getRSAPublicKeyFromEnv();
          console.log(
            'RSA public key loaded from environment variables (fallback)'
          );
        }

        return this.rsaPublicKey!;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error(
          `Failed to get RSA public key from both ${keySource} and fallback source`
        );
      }
    }
  }

  /**
   * Generate a secure random AES key (32 bytes for AES-256)
   */
  generateAESKey(): string {
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  }

  /**
   * Generate a secure random IV (16 bytes for AES-CBC)
   */
  generateIV(): string {
    return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  }

  /**
   * Encrypt data using AES-256-CBC
   */
  encryptWithAES(data: any, aesKey: string, iv: string): string {
    try {
      const key = CryptoJS.enc.Hex.parse(aesKey);
      const ivWordArray = CryptoJS.enc.Hex.parse(iv);

      const dataString = typeof data === 'string' ? data : JSON.stringify(data);

      const encrypted = CryptoJS.AES.encrypt(dataString, key, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Return as HEX instead of Base64 (backend expects HEX format)
      return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    } catch (error) {
      console.error('AES encryption error:', error);
      throw new Error('Failed to encrypt data with AES');
    }
  }

  /**
   * Decrypt data using AES-256-CBC
   */
  decryptWithAES(encryptedData: string, aesKey: string, iv: string): string {
    try {
      const key = CryptoJS.enc.Hex.parse(aesKey);
      const ivWordArray = CryptoJS.enc.Hex.parse(iv);

      // Create CipherParams object from HEX encrypted data
      const encryptedDataWordArray = CryptoJS.enc.Hex.parse(encryptedData);
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: encryptedDataWordArray,
      });

      const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        throw new Error('Decryption failed - invalid key or corrupted data');
      }

      return decryptedString;
    } catch (error) {
      console.error('AES decryption error:', error);
      throw new Error('Failed to decrypt data with AES');
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
      const encrypted = forgePublicKey.encrypt(aesKeyBytes, 'RSA-OAEP');

      // Return as HEX instead of Base64 (backend expects HEX format)
      return forge.util.bytesToHex(encrypted);
    } catch (error) {
      console.error('RSA encryption error:', error);
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
      const encryptionEnabled =
        import.meta.env.VITE_ENABLE_ENCRYPTION === 'true';
      if (!encryptionEnabled) {
        // Return data as-is if encryption is disabled
        return {
          encryptedData: typeof data === 'string' ? data : JSON.stringify(data),
          encryptedAESKey: '',
          iv: '',
          aesKey: '',
        };
      }

      // Ensure we have the RSA public key
      const rsaPublicKey = await this.ensureRSAPublicKey();

      // Generate AES key and IV
      const aesKey = this.generateAESKey();
      const iv = this.generateIV();

      // Encrypt the data with AES
      const encryptedData = this.encryptWithAES(data, aesKey, iv);

      // Encrypt the AES key with RSA
      const encryptedAESKey = this.encryptAESKeyWithRSA(aesKey, rsaPublicKey);

      return {
        encryptedData,
        encryptedAESKey,
        iv,
        aesKey, // Include the AES key for response decryption
      };
    } catch (error) {
      console.error('Encryption process error:', error);
      throw new Error('Failed to encrypt payload');
    }
  }

  /**
   * Decrypt response data using stored AES key and IV
   */
  decryptResponse(params: DecryptionParams): any {
    try {
      const encryptionEnabled =
        import.meta.env.VITE_ENABLE_ENCRYPTION === 'true';

      if (!encryptionEnabled) {
        // Return data as-is if encryption is disabled
        try {
          return JSON.parse(params.encryptedData);
        } catch {
          return params.encryptedData;
        }
      }

      const decryptedString = this.decryptWithAES(
        params.encryptedData,
        params.aesKey,
        params.iv
      );

      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(decryptedString);
      } catch {
        return decryptedString;
      }
    } catch (error) {
      console.error('Decryption process error:', error);
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
}

// Export singleton instance
export const encryptionService = new EncryptionService();
export default encryptionService;
