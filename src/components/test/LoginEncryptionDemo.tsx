import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEncryption } from '@/hooks/useEncryption';
import { authApi } from '@/features/auth/api/authApi';

/**
 * Demonstration component showing how encryption works with login
 * This component simulates the exact same flow as LoginForm but with visible encryption steps
 */
const LoginEncryptionDemo: React.FC = () => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [step, setStep] = useState<string>('ready');
  const [encryptionDetails, setEncryptionDetails] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);

  const { encryptPayload, isEncryptionEnabled, isRSAKeyLoaded } =
    useEncryption();

  const demonstrateEncryptedLogin = async () => {
    try {
      setStep('starting');
      setEncryptionDetails(null);
      setResponse(null);

      // Step 1: Show original credentials
      const originalCredentials = { email, password };
      console.log('1. Original credentials:', originalCredentials);

      // Step 2: Encrypt the credentials (this happens automatically in real LoginForm)
      setStep('encrypting');
      const encryptionResult = await encryptPayload(originalCredentials);

      setEncryptionDetails({
        originalData: originalCredentials,
        encryptedData: encryptionResult.encryptedData,
        encryptedAESKey: encryptionResult.encryptedAESKey,
        iv: encryptionResult.iv,
        aesKey: encryptionResult.aesKey, // This is normally stored internally
      });

      console.log('2. Encryption result:', {
        encryptedData: encryptionResult.encryptedData.substring(0, 50) + '...',
        encryptedAESKey:
          encryptionResult.encryptedAESKey.substring(0, 50) + '...',
        iv: encryptionResult.iv,
      });

      // Step 3: Make the actual API call (this happens automatically in LoginForm)
      setStep('api-call');

      // Note: This will fail because we don't have a real server, but it shows the flow
      try {
        const loginResponse = await authApi.loginUser({ email, password });
        setResponse(loginResponse);
        setStep('success');
      } catch (error) {
        console.log('3. API call would send encrypted data to server');
        console.log('Expected server request payload:', {
          encryptedData: encryptionResult.encryptedData,
          encryptedAESKey: encryptionResult.encryptedAESKey,
          iv: encryptionResult.iv,
        });

        setResponse({
          error: 'Demo mode - server not configured for encryption',
          note: 'In real scenario, server would decrypt and process login',
        });
        setStep('demo-complete');
      }
    } catch (error) {
      console.error('Demo error:', error);
      setStep('error');
      setResponse({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  const simulateNormalLogin = async () => {
    try {
      setStep('normal-login');

      // This is exactly what happens in LoginForm
      const loginResponse = await authApi.loginUser({ email, password });
      setResponse(loginResponse);
      setStep('success');
    } catch (error) {
      console.log(
        'Normal login attempt (will be encrypted automatically if enabled)'
      );
      setResponse({
        error: 'Demo mode - this would work with real server',
        note: 'LoginForm works exactly like this',
      });
      setStep('demo-complete');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">
        Login Encryption Demonstration
      </h1>

      {/* Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Encryption Status</h2>
        <div className="space-y-1">
          <p>
            <strong>Encryption Enabled:</strong>{' '}
            {isEncryptionEnabled ? '✅ Yes' : '❌ No'}
          </p>
          <p>
            <strong>RSA Key Loaded:</strong>{' '}
            {isRSAKeyLoaded ? '✅ Yes' : '❌ No'}
          </p>
          <p>
            <strong>Current Step:</strong> {step}
          </p>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Demo Credentials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
        </div>
      </div>

      {/* Demo Actions */}
      <div className="mb-6 space-x-4">
        <Button
          onClick={demonstrateEncryptedLogin}
          disabled={!isEncryptionEnabled || !isRSAKeyLoaded}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Show Encryption Steps
        </Button>
        <Button
          onClick={simulateNormalLogin}
          className="bg-green-600 hover:bg-green-700"
        >
          Simulate LoginForm Flow
        </Button>
      </div>

      {/* Encryption Details */}
      {encryptionDetails && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Encryption Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-gray-700">
                1. Original Data (LoginForm input):
              </h3>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(encryptionDetails.originalData, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-700">
                2. Encrypted Data (sent to server):
              </h3>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-32">
                {encryptionDetails.encryptedData.substring(0, 200)}...
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-700">
                3. Encrypted AES Key (RSA encrypted):
              </h3>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-20">
                {encryptionDetails.encryptedAESKey.substring(0, 100)}...
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-700">
                4. IV (Initialization Vector):
              </h3>
              <pre className="bg-gray-50 p-3 rounded text-sm">
                {encryptionDetails.iv}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Response</h2>
          <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-40">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {/* Explanation */}
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h2 className="text-lg font-semibold mb-2">
          How This Works in LoginForm
        </h2>
        <div className="text-sm space-y-2">
          <p>
            <strong>1. User Experience:</strong> Identical to current LoginForm
            - no changes visible to user
          </p>
          <p>
            <strong>2. Form Submission:</strong> handleLogin() calls mutate()
            with {`{ email, password }`}
          </p>
          <p>
            <strong>3. API Call:</strong> authApi.loginUser() uses
            axiosInstance.post()
          </p>
          <p>
            <strong>4. Automatic Encryption:</strong> Request interceptor
            encrypts data transparently
          </p>
          <p>
            <strong>5. Server Processing:</strong> Server decrypts and processes
            normal login
          </p>
          <p>
            <strong>6. Response:</strong> Server returns tokens (encrypted or
            plain)
          </p>
          <p>
            <strong>7. Automatic Decryption:</strong> Response interceptor
            decrypts if needed
          </p>
          <p>
            <strong>8. Success Flow:</strong> useLogin hook receives normal
            LoginResponse
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginEncryptionDemo;
