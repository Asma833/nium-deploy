import { AxiosRequestConfig } from 'axios';

// Extend AxiosRequestConfig to include our custom encryption control property
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  skipEncryption?: boolean;
}

/**
 * Utility functions for controlling encryption on specific API calls
 */
export class EncryptionControlUtils {
  /**
   * Create axios config that skips encryption for this request
   */
  static withoutEncryption(config?: AxiosRequestConfig): ExtendedAxiosRequestConfig {
    return {
      ...config,
      skipEncryption: true,
    };
  }

  /**
   * Create axios config that forces encryption for this request
   */
  static withEncryption(config?: AxiosRequestConfig): ExtendedAxiosRequestConfig {
    return {
      ...config,
      skipEncryption: false,
      headers: {
        ...config?.headers,
        'X-Force-Encryption': 'true',
      },
    };
  }

  /**
   * Create axios config with custom encryption control header
   */
  static withEncryptionControl(skipEncryption: boolean, config?: AxiosRequestConfig): ExtendedAxiosRequestConfig {
    return {
      ...config,
      skipEncryption,
      headers: {
        ...config?.headers,
        'X-Skip-Encryption': skipEncryption.toString(),
      },
    };
  }

  /**
   * Add endpoint to the skip list dynamically (for testing)
   */
  static addSkipEndpoint(endpoint: string): void {
    // This would require modifying the interceptor to use a dynamic list
  }
}

export default EncryptionControlUtils;
