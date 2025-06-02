import React, { useState } from 'react';
import { useEncryption } from '@/hooks/useEncryption';
import { EncryptedApiUtils } from '@/core/services/encryption/encryptedApiUtils';
import encryptionService from '@/core/services/encryption';

/**
 * Example component demonstrating encryption functionality
 * This is for testing and demonstration purposes
 */
const EncryptionTestComponent: React.FC = () => {
  const [testData, setTestData] = useState('{"message": "Hello, World!"}');
  const [encryptedResult, setEncryptedResult] = useState<string>('');
  const [decryptedResult, setDecryptedResult] = useState<string>('');
  const [rsaKeyStatus, setRsaKeyStatus] = useState<string>('Not loaded');

  const {
    encryptPayload,
    decryptResponse,
    isEncryptionEnabled,
    isRSAKeyLoaded,
    fetchRSAKey,
    error,
    loading,
  } = useEncryption();

  const handleTestEncryption = async () => {
    try {
      const data = JSON.parse(testData);
      const result = await encryptPayload(data);

      setEncryptedResult(
        JSON.stringify(
          {
            encryptedData: result.encryptedData,
            encryptedAESKey: result.encryptedAESKey,
            iv: result.iv,
          },
          null,
          2
        )
      );

      // Test decryption
      const decrypted = decryptResponse({
        encryptedData: result.encryptedData,
        aesKey: result.aesKey,
        iv: result.iv,
      });

      setDecryptedResult(JSON.stringify(decrypted, null, 2));
    } catch (err) {
      console.error('Encryption test failed:', err);
      setEncryptedResult(
        `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  };

  const handleFetchRSAKey = async () => {
    try {
      await fetchRSAKey();
      setRsaKeyStatus(
        isRSAKeyLoaded ? 'Loaded successfully' : 'Failed to load'
      );
    } catch (err) {
      setRsaKeyStatus(
        `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  };

  const handleTestApiCall = async () => {
    try {
      // Example of using encrypted API utils
      const response = await EncryptedApiUtils.encryptedPost('/api/test', {
        message: 'This is a test message',
        timestamp: new Date().toISOString(),
      });

      console.log('Encrypted API response:', response.data);
    } catch (err) {
      console.error('Encrypted API call failed:', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Encryption Test Component</h1>

      {/* Status Information */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Encryption Status</h2>
        <div className="space-y-2">
          <p>
            <strong>Encryption Enabled:</strong>{' '}
            {isEncryptionEnabled ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>RSA Key Loaded:</strong> {isRSAKeyLoaded ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>RSA Key Status:</strong> {rsaKeyStatus}
          </p>
          {error && (
            <p className="text-red-600">
              <strong>Error:</strong> {error}
            </p>
          )}
          {loading && <p className="text-blue-600">Loading...</p>}
        </div>
      </div>

      {/* RSA Key Management */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">RSA Key Management</h2>
        <button
          onClick={handleFetchRSAKey}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch RSA Public Key'}
        </button>
      </div>

      {/* Encryption Test */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Test Encryption/Decryption
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Test Data (JSON):
            </label>
            <textarea
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              className="w-full p-2 border rounded h-20"
              placeholder="Enter JSON data to encrypt"
            />
          </div>

          <button
            onClick={handleTestEncryption}
            disabled={!isEncryptionEnabled || !isRSAKeyLoaded}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Encryption/Decryption
          </button>

          {encryptedResult && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Encrypted Result:
              </label>
              <pre className="w-full p-2 border rounded bg-gray-50 text-sm overflow-auto max-h-40">
                {encryptedResult}
              </pre>
            </div>
          )}

          {decryptedResult && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Decrypted Result:
              </label>
              <pre className="w-full p-2 border rounded bg-gray-50 text-sm overflow-auto max-h-40">
                {decryptedResult}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* API Test */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Test Encrypted API Call</h2>
        <button
          onClick={handleTestApiCall}
          disabled={!isEncryptionEnabled || !isRSAKeyLoaded}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test Encrypted API Call
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Check the browser console for API response
        </p>
      </div>

      {/* Manual Crypto Functions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Manual Crypto Functions</h2>
        <div className="space-y-2">
          <button
            onClick={() => {
              const key = encryptionService.generateAESKey();
              console.log('Generated AES Key:', key);
            }}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm mr-2"
          >
            Generate AES Key
          </button>

          <button
            onClick={() => {
              const iv = encryptionService.generateIV();
              console.log('Generated IV:', iv);
            }}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm mr-2"
          >
            Generate IV
          </button>

          <button
            onClick={() => {
              const publicKey = encryptionService.getRSAPublicKey();
              console.log('Current RSA Public Key:', publicKey);
            }}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
          >
            Show RSA Key
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Check the browser console for generated values
        </p>
      </div>
    </div>
  );
};

export default EncryptionTestComponent;
