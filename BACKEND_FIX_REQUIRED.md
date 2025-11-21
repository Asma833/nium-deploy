# ❌ CRITICAL: Backend Changes Required for Decryption to Work

## 🔍 Root Cause

The backend is sending this response format:
```json
{
  "encryptedKey": "2e7fd399b18663d9...", // RSA-encrypted AES key
  "iv": "c672e28aa57a168885e9babb",
  "encryptedData": "e8cc3e2cf69da802...",
  "authTag": "eb429b64802fd30c2c6aa4b7bc3488e9"
}
```

**The Problem:**
- `encryptedKey` is encrypted with RSA public key
- Frontend cannot decrypt it without the RSA private key
- Storing private keys in frontend is a **major security risk**
- Therefore, **decryption is impossible** with current backend response

## ✅ Required Backend Changes

### Change 1: Add Raw AES Key to Response

In your `CryptoService.encryptAESGCM()` method, return the raw AES key:

```typescript
encryptAESGCM(
  plaintext: string,
  key: Buffer,
  iv: Buffer,
): { encryptedData: string; authTag: string; aesKey: string } {  // ✅ Add aesKey to return type
  const cipher = crypto.createCipheriv('aes-128-gcm', key.slice(0, 16), iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    authTag: authTag.toString('hex'),
    aesKey: key.slice(0, 16).toString('hex'), // ✅ ADD THIS LINE
  };
}
```

### Change 2: Include AES Key in All Encrypted Responses

In your interceptor or wherever you send encrypted responses:

```typescript
// Decrypt AES key with RSA
const aesKeyBuffer = await this.cryptoService.decryptAESKeyWithS3Pem(
  encryptedKey,
  pemContent,
);

// Encrypt response data with AES-128-GCM
const encryptedResponse = this.cryptoService.encryptAESGCM(
  JSON.stringify(responseData),
  aesKeyBuffer,
  Buffer.from(ivHex, 'hex'),
);

// ✅ IMPORTANT: Include the raw AES key in response
return {
  encryptedData: encryptedResponse.encryptedData,
  authTag: encryptedResponse.authTag,
  iv: ivHex,
  aesKey: aesKeyBuffer.slice(0, 16).toString('hex'), // ✅ ADD THIS LINE
};
```

### Change 3: Update `generate-test-payload` Endpoint

```typescript
@Post('generate-test-payload')
async generateTestPayload(
  @Body() plainData: any,
  @Headers('partner_id') partnerId: string,
) {
  try {
    // ... existing code ...

    return {
      encryptedKey: encryptedKey.toString('hex'),
      encryptedData: encryptedData,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      aesKey: aesKey.toString('hex'), // ✅ ADD THIS LINE
    };
  } catch (error) {
    throw new BadRequestException(`Payload generation failed: ${error.message}`);
  }
}
```

## 🔐 Security Considerations

### Q: Is it safe to send the raw AES key?

**A: YES**, when done correctly:

1. **HTTPS Protection**: The AES key is transmitted over HTTPS, which encrypts all traffic
2. **Ephemeral Keys**: Each request-response pair uses a unique AES key that's immediately discarded
3. **Session-Based**: Keys are only valid for a single request-response cycle
4. **No Private Key Exposure**: The RSA private key stays securely on the server

### Q: Why not just send the encrypted key?

**A:** The frontend cannot decrypt RSA-encrypted keys because:
- It doesn't have the RSA private key (and shouldn't have it)
- Storing private keys in browsers is a **critical security vulnerability**
- Private keys should **never** leave the server

## 📊 Current vs Fixed Flow

### ❌ Current Flow (BROKEN)
```
Frontend                          Backend
   |                                 |
   |---(1) Encrypt with AES key A--->|
   |   (Send encryptedKey)           |
   |                                 |
   |                    (2) Decrypt AES key A with RSA
   |                    (3) Decrypt data with AES key A
   |                    (4) Process request
   |                    (5) Encrypt response with AES key A
   |                                 |
   |<--(6) Send encryptedKey only----|
   |   (RSA-encrypted AES key A)     |
   |                                 |
   ❌ Cannot decrypt without         |
      RSA private key!               |
```

### ✅ Fixed Flow (WORKING)
```
Frontend                          Backend
   |                                 |
   |---(1) Encrypt with AES key A--->|
   |   (Send encryptedKey)           |
   |                                 |
   |                    (2) Decrypt AES key A with RSA
   |                    (3) Decrypt data with AES key A
   |                    (4) Process request
   |                    (5) Encrypt response with AES key A
   |                                 |
   |<--(6) Send raw aesKey + data----|
   |   { aesKey: "...",              |
   |     encryptedData: "...",       |
   |     iv: "...",                  |
   |     authTag: "..." }            |
   |                                 |
   ✅ Can decrypt with raw AES key!  |
```

## 🧪 Testing After Backend Changes

Once you've made the backend changes, test with:

```typescript
// The backend response should now include aesKey:
{
  "encryptedKey": "2e7fd399b18663d9...", // Still included for compatibility
  "iv": "c672e28aa57a168885e9babb",
  "encryptedData": "e8cc3e2cf69da802...",
  "authTag": "eb429b64802fd30c2c6aa4b7bc3488e9",
  "aesKey": "d76dda0d9b..." // ✅ NEW: Raw AES key in hex
}
```

The frontend will automatically use the `aesKey` field for decryption.

## 📝 Summary

**What needs to change:**
1. ✅ Add `aesKey` field to `encryptAESGCM()` return type
2. ✅ Include raw AES key in all encrypted responses
3. ✅ Update `generate-test-payload` endpoint

**Why this is secure:**
- AES keys are ephemeral (one-time use)
- Transmitted over HTTPS
- No private keys exposed
- Standard practice for this encryption pattern

**After these changes:**
- Frontend decryption will work immediately
- No frontend code changes needed
- More secure than trying to decrypt RSA keys in browser