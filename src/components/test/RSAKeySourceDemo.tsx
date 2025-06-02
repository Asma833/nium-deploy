import React, { useState, useEffect } from 'react';
import { encryptionService } from '../../core/services/encryption';

interface EncryptionConfig {
  encryptionEnabled: boolean;
  rsaKeySource: 'api' | 'env';
  hasRsaKeyInEnv: boolean;
  hasRsaEndpoint: boolean;
  hasCachedKey: boolean;
}

const RSAKeySourceDemo: React.FC = () => {
  const [config, setConfig] = useState<EncryptionConfig | null>(null);
  const [rsaKey, setRsaKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    // Load initial configuration
    const initialConfig = encryptionService.getEncryptionConfig();
    setConfig(initialConfig);
    setRsaKey(encryptionService.getRSAPublicKey());
  }, []);

  const refreshConfig = () => {
    const updatedConfig = encryptionService.getEncryptionConfig();
    setConfig(updatedConfig);
    setRsaKey(encryptionService.getRSAPublicKey());
  };

  const testRSAKeyLoading = async () => {
    setLoading(true);
    setError(null);
    try {
      // Reset any cached key to force loading
      encryptionService.resetRSAKey();

      // Load RSA key using current configuration
      const key = await encryptionService.ensureRSAPublicKey();
      setRsaKey(key);

      // Refresh config to show updated state
      refreshConfig();

      console.log('RSA key loaded successfully:', key.substring(0, 50) + '...');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to load RSA key:', err);
    } finally {
      setLoading(false);
    }
  };

  const testEncryption = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const testData = {
        message: 'Hello, World!',
        timestamp: Date.now(),
        testArray: [1, 2, 3, 4, 5],
        nested: {
          value: 'nested test data',
          boolean: true,
        },
      };

      const result = await encryptionService.encryptPayload(testData);
      setTestResult({
        original: testData,
        encrypted: {
          encryptedData: result.encryptedData.substring(0, 50) + '...',
          encryptedAESKey: result.encryptedAESKey.substring(0, 50) + '...',
          iv: result.iv,
          aesKeyLength: result.aesKey.length,
        },
      });

      console.log('Encryption test successful:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Encryption test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetCache = () => {
    encryptionService.resetRSAKey();
    setRsaKey(null);
    refreshConfig();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>RSA Key Source Configuration Demo</h2>

      {/* Configuration Display */}
      <div
        style={{
          border: '1px solid #ddd',
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '5px',
        }}
      >
        <h3>Current Configuration</h3>
        {config && (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>
              <strong>Encryption Enabled:</strong>{' '}
              {config.encryptionEnabled ? '✅ Yes' : '❌ No'}
            </li>
            <li>
              <strong>RSA Key Source:</strong>{' '}
              {config.rsaKeySource.toUpperCase()}
            </li>
            <li>
              <strong>RSA Key in Environment:</strong>{' '}
              {config.hasRsaKeyInEnv ? '✅ Available' : '❌ Not set'}
            </li>
            <li>
              <strong>RSA API Endpoint:</strong>{' '}
              {config.hasRsaEndpoint ? '✅ Configured' : '❌ Not set'}
            </li>
            <li>
              <strong>Cached RSA Key:</strong>{' '}
              {config.hasCachedKey ? '✅ Available' : '❌ Not cached'}
            </li>
          </ul>
        )}
        <button
          onClick={refreshConfig}
          style={{
            marginTop: '10px',
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Refresh Config
        </button>
      </div>

      {/* Current RSA Key Display */}
      <div
        style={{
          border: '1px solid #ddd',
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#f0f8ff',
          borderRadius: '5px',
        }}
      >
        <h3>Current RSA Key</h3>
        {rsaKey ? (
          <div>
            <p>
              <strong>Key loaded:</strong> ✅
            </p>
            <textarea
              value={rsaKey}
              readOnly
              style={{
                width: '100%',
                height: '100px',
                fontFamily: 'monospace',
                fontSize: '12px',
                marginTop: '10px',
              }}
            />
          </div>
        ) : (
          <p>
            <strong>No RSA key loaded</strong> ❌
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testRSAKeyLoading}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Loading...' : 'Test RSA Key Loading'}
        </button>

        <button
          onClick={testEncryption}
          disabled={loading || !config?.encryptionEnabled}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#ffc107',
            color: '#212529',
            border: 'none',
            borderRadius: '5px',
            cursor:
              loading || !config?.encryptionEnabled ? 'not-allowed' : 'pointer',
            opacity: loading || !config?.encryptionEnabled ? 0.6 : 1,
          }}
        >
          Test Full Encryption
        </button>

        <button
          onClick={resetCache}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Reset Cache
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            border: '1px solid #dc3545',
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '5px',
          }}
        >
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Test Result Display */}
      {testResult && (
        <div
          style={{
            border: '1px solid #28a745',
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#d4edda',
            borderRadius: '5px',
          }}
        >
          <h3>Encryption Test Result</h3>
          <pre
            style={{
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '3px',
              overflow: 'auto',
              fontSize: '12px',
            }}
          >
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          border: '1px solid #17a2b8',
          padding: '15px',
          backgroundColor: '#d1ecf1',
          borderRadius: '5px',
        }}
      >
        <h3>How to Test</h3>
        <ol style={{ marginLeft: '20px' }}>
          <li>
            <strong>Environment Mode (Default):</strong> Currently set to use
            RSA key from environment variables
            <ul>
              <li>
                The system loads the key from <code>VITE_RSA_PUBLIC_KEY</code>
              </li>
              <li>Falls back to API if environment key is not available</li>
            </ul>
          </li>
          <li>
            <strong>API Mode:</strong> To test API mode, change{' '}
            <code>VITE_RSA_KEY_SOURCE=api</code> in .env.development
            <ul>
              <li>
                The system will fetch the key from the configured endpoint
              </li>
              <li>Falls back to environment key if API fails</li>
            </ul>
          </li>
          <li>
            <strong>Testing Steps:</strong>
            <ul>
              <li>
                Click "Test RSA Key Loading" to see how the system loads the key
              </li>
              <li>
                Click "Test Full Encryption" to test the complete encryption
                process
              </li>
              <li>
                Click "Reset Cache" to clear the cached key and force reloading
              </li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default RSAKeySourceDemo;
