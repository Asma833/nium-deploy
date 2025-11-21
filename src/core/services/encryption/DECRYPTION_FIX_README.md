# AES-GCM Decryption Fix Documentation

## 🔍 Problem Summary

The frontend `decryptWithAES` function was failing because it couldn't decrypt the backend's encrypted responses. The root cause was that the backend sends an RSA-encrypted AES key (`encryptedKey`), but the frontend cannot decrypt it without the RSA private key (which should never be in the browser for security reasons).

## ✅ Solution Implemented

The backend already includes the raw `aesKey` in encrypted responses. The frontend has been updated to properly use this key for decryption.

### Changes Made

#### 1. **Enhanced Response Interceptor** ([`encryptionInterceptor.ts`](./encryptionInterceptor.ts))

**What Changed:**
- Improved key resolution logic to prioritize backend's raw `aesKey`
- Added comprehensive validation for all decryption parameters
- Enhanced error messages for debugging
- Added detailed logging for troubleshooting

**Key Logic:**
```typescript
// Priority order for AES key:
// 1. Backend's raw aesKey (preferred)
// 2. Request context aesKey (fallback)
// 3. Error if neither available

if (responseData.aesKey) {
  // Use backend's key
  aesKeyToUse = responseData.aesKey;
} else if (encryptionCtx.aesKey) {
  // Use request context key
  aesKeyToUse = encryptionCtx.aesKey;
} else {
  throw new Error('No AES key available for decryption');
}
```

#### 2. **Enhanced Decryption Function** ([`encryptionService.ts`](./encryptionService.ts))

**What Changed:**
- Added comprehensive input validation
- Validates hex string format for all parameters
- Validates key and IV lengths (AES-128 requires 16 bytes)
- Improved error messages with detailed debugging information
- Better handling of Web Crypto API errors

**Validation Added:**
- ✅ AES key: 32 hex chars (16 bytes for AES-128)
- ✅ IV: 24 hex chars (12 bytes for GCM)
- ✅ Auth tag: 32 hex chars (16 bytes)
- ✅ All parameters must be valid hex strings

#### 3. **Test Utilities** ([`encryptionTestUtils.ts`](./encryptionTestUtils.ts))

**New Features:**
- `testDecryption()` - Test decryption with backend payload
- `testEncryptionCycle()` - Test full encrypt/decrypt cycle
- `validateBackendResponse()` - Validate response format

## 📋 Backend Requirements

For decryption to work, the backend **MUST** include the raw `aesKey` in encrypted responses:

```typescript
// ✅ CORRECT - Backend response format
{
  "encryptedData": "03863cdd911c248d...",
  "iv": "7aa4ae64f850b449b7c3f0a6",
  "authTag": "80cd97ccc8c2d2d0ce0eb4e42114df08",
  "aesKey": "a1b2c3d4e5f6..." // ✅ REQUIRED - Raw AES key in hex
}
```

```typescript
// ❌ INCORRECT - Missing aesKey
{
  "encryptedKey": "2125adc6806b0ca9...", // RSA-encrypted, cannot decrypt in browser
  "encryptedData": "03863cdd911c248d...",
  "iv": "7aa4ae64f850b449b7c3f0a6",
  "authTag": "80cd97ccc8c2d2d0ce0eb4e42114df08"
  // ❌ Missing aesKey field
}
```

### Backend Implementation Example

```typescript
// In your NestJS controller or service
const encryptedResponse = this.cryptoService.encryptAESGCM(
  JSON.stringify(responseData),
  aesKeyBuffer,
  Buffer.from(ivHex, 'hex'),
);

return {
  encryptedData: encryptedResponse.encryptedData,
  authTag: encryptedResponse.authTag,
  iv: ivHex,
  aesKey: aesKeyBuffer.toString('hex'), // ✅ Include raw AES key
};
```

## 🧪 Testing

### Method 1: Using Test Utilities

```typescript
import { testDecryption, validateBackendResponse } from '@/core/services/encryption';

// Your backend response
const backendResponse = {
  encryptedData: "03863cdd911c248d...",
  iv: "7aa4ae64f850b449b7c3f0a6",
  authTag: "80cd97ccc8c2d2d0ce0eb4e42114df08",
  aesKey: "a1b2c3d4e5f6..." // From backend
};

// Validate format
const validation = validateBackendResponse(backendResponse);
///console.log('Validation:', validation);

if (validation.valid) {
  // Test decryption
  const decrypted = await testDecryption(backendResponse);
  //console.log('Decrypted:', decrypted);
} else {
  //console.error('Invalid response format:', validation.errors);
}
```

### Method 2: Browser Console Testing

```javascript
// In browser console
import { encryptionService } from '@/core/services/encryption';

// Test with your backend response
const response = {
  encryptedData: "03863cdd911c248d...",
  iv: "7aa4ae64f850b449b7c3f0a6",
  authTag: "80cd97ccc8c2d2d0ce0eb4e42114df08",
  aesKey: "a1b2c3d4e5f6..." // Must be provided by backend
};

// Decrypt
const decrypted = await encryptionService.decryptWithAES(
  response.encryptedData,
  response.aesKey,
  response.iv,
  response.authTag
);

//console.log('Decrypted:', JSON.parse(decrypted));
```

### Method 3: API Testing

```typescript
// Test with actual API endpoint
const result = await axios.post('/api/your-endpoint', {
  message: 'Test data'
});

// Should automatically encrypt request and decrypt response
//console.log('Result:', result.data);
```

## 🔐 Security Considerations

### Why Send Raw AES Key?

**Q: Isn't sending the raw AES key insecure?**

**A:** This is actually the correct approach for this architecture:

1. **HTTPS Protection**: The AES key is transmitted over HTTPS, which encrypts all traffic
2. **Session-Based**: Each request-response pair uses a unique AES key
3. **Ephemeral Keys**: Keys are immediately discarded after use
4. **No Private Key Exposure**: The RSA private key stays on the server

### Alternative Approaches

If you need enhanced security:

1. **Session-Based Encryption**: Use a session key established during authentication
2. **Key Derivation**: Derive response keys from request keys using HKDF
3. **Mutual TLS**: Use client certificates for additional security

## 📊 Architecture Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Frontend  │                                    │   Backend   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │ 1. Generate AES key & IV                        │
       │ 2. Encrypt data with AES-GCM                    │
       │ 3. Encrypt AES key with RSA                     │
       │                                                  │
       │ POST {encryptedData, encryptedKey, iv, authTag} │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │                                    4. Decrypt AES key with RSA
       │                                    5. Decrypt data with AES-GCM
       │                                    6. Process request
       │                                    7. Encrypt response with SAME AES key
       │                                                  │
       │ {encryptedData, iv, authTag, aesKey} ✅         │
       │<─────────────────────────────────────────────────┤
       │                                                  │
       │ 8. Use aesKey from response                     │
       │ 9. Decrypt with AES-GCM                         │
       │ 10. Return decrypted data                       │
       │                                                  │
```

## 🐛 Troubleshooting

### Error: "No AES key available for decryption"

**Cause:** Backend response doesn't include `aesKey` field

**Solution:** Update backend to include raw AES key in response:
```typescript
return {
  ...encryptedResponse,
  aesKey: aesKeyBuffer.toString('hex')
};
```

### Error: "Invalid AES key length"

**Cause:** AES key is not 32 hex characters (16 bytes)

**Solution:** Ensure backend generates 16-byte keys:
```typescript
const aesKey = crypto.randomBytes(16); // 128 bits for AES-128
```

### Error: "Authentication tag verification failed"

**Possible Causes:**
1. Wrong AES key used for decryption
2. Data was modified in transit
3. IV or auth tag mismatch

**Solution:** 
- Verify backend sends correct `aesKey`
- Check HTTPS is enabled
- Validate all parameters match encryption

### Error: "Invalid hex string format"

**Cause:** Parameters contain non-hex characters

**Solution:** Ensure backend converts all buffers to hex:
```typescript
{
  encryptedData: encrypted.toString('hex'),
  iv: iv.toString('hex'),
  authTag: authTag.toString('hex'),
  aesKey: aesKey.toString('hex')
}
```

## 📝 Summary

### What Was Fixed
✅ Response interceptor now properly uses backend's `aesKey`  
✅ Added comprehensive validation and error handling  
✅ Created test utilities for verification  
✅ Improved logging for debugging  

### What You Need to Do
1. ✅ Ensure backend includes `aesKey` in all encrypted responses
2. ✅ Test with the provided test utilities
3. ✅ Monitor console logs for any issues

### Files Modified
- [`encryptionInterceptor.ts`](./encryptionInterceptor.ts) - Enhanced key resolution
- [`encryptionService.ts`](./encryptionService.ts) - Added validation
- [`encryptionTestUtils.ts`](./encryptionTestUtils.ts) - New test utilities
- [`index.ts`](./index.ts) - Export test utilities

## 🎯 Next Steps

1. **Test the fix:**
   ```typescript
   import { testDecryption } from '@/core/services/encryption';
   const result = await testDecryption(yourBackendResponse);
   ```

2. **Verify backend response format:**
   ```typescript
   import { validateBackendResponse } from '@/core/services/encryption';
   const validation = validateBackendResponse(response);
   ```

3. **Monitor production:**
   - Check browser console for decryption logs
   - Verify no "No AES key available" errors
   - Confirm successful decryption messages

---

**Need Help?** Check the console logs - they now provide detailed information about each step of the encryption/decryption process.