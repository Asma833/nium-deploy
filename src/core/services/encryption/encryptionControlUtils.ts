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
  static withoutEncryption(
    config?: AxiosRequestConfig
  ): ExtendedAxiosRequestConfig {
    return {
      ...config,
      skipEncryption: true,
      "x-encrypted-key":"8377e0c0f92c43bf7a1d82f6be40642a5ec3c32b86aa0132e7c112200166fdb2eaebda7d6ad80035db2e31a92a99cac5e3c47c782e68d794738edffa491fc9ea2865fbf1767cb050eca6c11ee87c28844742620a46c956c9f18ffcca5c3f6cd87945242ad09d3a1d0f610ea019798652d486a2e4bfa720494d4d836883ee2f962d9d19b2c7da70668382eb38d45ca6b8a9b9a6663b26f3b4cde222d7174c55a953e2b4685cf1a337e39634bf0fe7fae15dabbeef960ae6cbfe8084ffcc9f949b402f3fad6eded3df29f09c577271265d253759a2935ea7e075acd4f338348e2fdf414ad384f90b530e92d440eb6136a32593a0c14865b7622f1ae44390ecc767",
      "x-iv":"a9f5ff99cbdcff432439a769c13877da"
    };
  }

  /**
   * Create axios config that forces encryption for this request
   */
  static withEncryption(
    config?: AxiosRequestConfig
  ): ExtendedAxiosRequestConfig {
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
  static withEncryptionControl(
    skipEncryption: boolean,
    config?: AxiosRequestConfig
  ): ExtendedAxiosRequestConfig {
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
    console.warn(
      'Dynamic endpoint control not implemented yet. Use static configuration.'
    );
  }
}

export default EncryptionControlUtils;
