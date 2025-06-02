import { AxiosResponse } from 'axios';
import axiosInstance from '@/core/services/axios/axiosInstance';
import encryptionService from './encryptionService';
import EncryptionControlUtils from './encryptionControlUtils';

/**
 * Encrypted API utilities for manual encryption/decryption when needed
 */
export class EncryptedApiUtils {
  /**
   * Make an encrypted POST request
   */
  static async encryptedPost<T = any>(
    url: string,
    data: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    if (!encryptionService.isEncryptionEnabled()) {
      return axiosInstance.post<T>(url, data, config);
    }
    try {
      const encryptionResult = await encryptionService.encryptPayload(data);

      const encryptedPayload = {
        encryptedValue: encryptionResult.encryptedData,
        encryptedKey: encryptionResult.encryptedAESKey,
        iv: encryptionResult.iv,
      };
      const response = await axiosInstance.post<T>(url, encryptedPayload, {
        ...config,
        headers: {
          ...config?.headers,
          'X-AES-Key': encryptionResult.aesKey,
          'X-IV': encryptionResult.iv,
        },
      }); // Decrypt response if needed
      if (
        response.data &&
        typeof response.data === 'object' &&
        'encryptedValue' in response.data
      ) {
        const decryptedData = encryptionService.decryptResponse({
          encryptedData: (response.data as any).encryptedValue,
          aesKey: encryptionResult.aesKey,
          iv: encryptionResult.iv,
        });

        response.data = decryptedData;
      }

      return response;
    } catch (error) {
      console.error('Encrypted POST request failed:', error);
      throw error;
    }
  }

  /**
   * Make an encrypted PUT request
   */
  static async encryptedPut<T = any>(
    url: string,
    data: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    if (!encryptionService.isEncryptionEnabled()) {
      return axiosInstance.put<T>(url, data, config);
    }
    try {
      const encryptionResult = await encryptionService.encryptPayload(data);

      const encryptedPayload = {
        encryptedValue: encryptionResult.encryptedData,
        encryptedKey: encryptionResult.encryptedAESKey,
        iv: encryptionResult.iv,
      };
      const response = await axiosInstance.put<T>(url, encryptedPayload, {
        ...config,
        headers: {
          ...config?.headers,
          'X-AES-Key': encryptionResult.aesKey,
          'X-IV': encryptionResult.iv,
        },
      }); // Decrypt response if needed
      if (
        response.data &&
        typeof response.data === 'object' &&
        'encryptedValue' in response.data
      ) {
        const decryptedData = encryptionService.decryptResponse({
          encryptedData: (response.data as any).encryptedValue,
          aesKey: encryptionResult.aesKey,
          iv: encryptionResult.iv,
        });

        response.data = decryptedData;
      }

      return response;
    } catch (error) {
      console.error('Encrypted PUT request failed:', error);
      throw error;
    }
  }

  /**
   * Make an encrypted PATCH request
   */
  static async encryptedPatch<T = any>(
    url: string,
    data: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    if (!encryptionService.isEncryptionEnabled()) {
      return axiosInstance.patch<T>(url, data, config);
    }
    try {
      const encryptionResult = await encryptionService.encryptPayload(data);

      const encryptedPayload = {
        encryptedValue: encryptionResult.encryptedData,
        encryptedKey: encryptionResult.encryptedAESKey,
        iv: encryptionResult.iv,
      };
      const response = await axiosInstance.patch<T>(url, encryptedPayload, {
        ...config,
        headers: {
          ...config?.headers,
          'X-AES-Key': encryptionResult.aesKey,
          'X-IV': encryptionResult.iv,
        },
      }); // Decrypt response if needed
      if (
        response.data &&
        typeof response.data === 'object' &&
        'encryptedValue' in response.data
      ) {
        const decryptedData = encryptionService.decryptResponse({
          encryptedData: (response.data as any).encryptedValue,
          aesKey: encryptionResult.aesKey,
          iv: encryptionResult.iv,
        });

        response.data = decryptedData;
      }

      return response;
    } catch (error) {
      console.error('Encrypted PATCH request failed:', error);
      throw error;
    }
  }

  /**
   * Make a POST request without encryption (convenience method)
   */
  static async unencryptedPost<T = any>(
    url: string,
    data: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.post<T>(
      url,
      data,
      EncryptionControlUtils.withoutEncryption(config)
    );
  }

  /**
   * Make a PUT request without encryption (convenience method)
   */
  static async unencryptedPut<T = any>(
    url: string,
    data: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.put<T>(
      url,
      data,
      EncryptionControlUtils.withoutEncryption(config)
    );
  }

  /**
   * Make a PATCH request without encryption (convenience method)
   */
  static async unencryptedPatch<T = any>(
    url: string,
    data: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.patch<T>(
      url,
      data,
      EncryptionControlUtils.withoutEncryption(config)
    );
  }

  /**
   * Make a GET request (GET requests are never encrypted anyway)
   */
  static async get<T = any>(
    url: string,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.get<T>(url, config);
  }

  /**
   * Make a DELETE request (DELETE requests are never encrypted anyway)
   */
  static async delete<T = any>(
    url: string,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.delete<T>(url, config);
  }
}

export default EncryptedApiUtils;
