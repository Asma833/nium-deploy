// src/hooks/useEncryptDecrypt.js
import { useCallback } from 'react';
import CryptoJS from 'crypto-js';

/**
 * A React hook to encrypt and decrypt data using AES-CBC.
 * Now uses a random IV and prepends it to the ciphertext for decryption.
 */
const useEncryptDecrypt = () => {
  const encrypt = useCallback((keyString:string , value:string) => {
    const key = CryptoJS.enc.Utf8.parse(keyString);

    // Generate a secure random IV
    const iv = CryptoJS.lib.WordArray.random(16); // 128-bit IV

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()),
      key,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    // Concatenate IV + encrypted data and encode both as Base64 for transport
    const result = iv.toString(CryptoJS.enc.Base64) + encrypted.toString();

    // Make it URL-safe
    return result;
  }, []);

  const decrypt = useCallback((keyString: string, encryptedText: string) => {
    const key = CryptoJS.enc.Utf8.parse(keyString);

    // Revert character substitutions
    // const safeText = encryptedText.replace(/_plus/g, '+').replace(/slash_/g, '/');
    const safeText = encryptedText;  
    const [ivBase64, encryptedBase64] = safeText.split(':');

    if (!ivBase64 || !encryptedBase64) {
      throw new Error('Invalid encrypted format: missing IV or ciphertext');
    }

    const iv = CryptoJS.enc.Base64.parse(ivBase64);

    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }, []);

  return {
    encrypt,
    decrypt,
  };
};

export default useEncryptDecrypt;
