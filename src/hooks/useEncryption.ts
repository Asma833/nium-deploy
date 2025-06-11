import encryptionService, { DecryptionParams, EncryptionResult } from '@/core/services/encryption';
import { useCallback, useEffect, useState } from 'react';

interface UseEncryptionReturn {
  encryptPayload: (data: any) => Promise<EncryptionResult>;
  decryptResponse: (params: DecryptionParams) => any;
  isEncryptionEnabled: boolean;
  isRSAKeyLoaded: boolean;
  fetchRSAKey: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

/**
 * React hook for encryption and decryption operations
 * Provides enhanced encryption with AES-256-CBC and RSA-2048
 */
export const useEncryption = (): UseEncryptionReturn => {
  const [isRSAKeyLoaded, setIsRSAKeyLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEncryptionEnabled = encryptionService.isEncryptionEnabled();

  const fetchRSAKey = useCallback(async () => {
    if (!isEncryptionEnabled) {
      setIsRSAKeyLoaded(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await encryptionService.fetchRSAPublicKey();
      setIsRSAKeyLoaded(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch RSA key';
      setError(errorMessage);
      console.error('Error fetching RSA key:', err);
    } finally {
      setLoading(false);
    }
  }, [isEncryptionEnabled]);

  const encryptPayload = useCallback(async (data: any): Promise<EncryptionResult> => {
    try {
      setError(null);
      return await encryptionService.encryptPayload(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const decryptResponse = useCallback((params: DecryptionParams): any => {
    try {
      setError(null);
      return encryptionService.decryptResponse(params);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Decryption failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Auto-fetch RSA key on mount if encryption is enabled
  useEffect(() => {
    if (isEncryptionEnabled && !isRSAKeyLoaded) {
      fetchRSAKey();
    }
  }, [isEncryptionEnabled, isRSAKeyLoaded, fetchRSAKey]);

  return {
    encryptPayload,
    decryptResponse,
    isEncryptionEnabled,
    isRSAKeyLoaded,
    fetchRSAKey,
    error,
    loading,
  };
};

export default useEncryption;
