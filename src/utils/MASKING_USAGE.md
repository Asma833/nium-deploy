# Masking Utility Usage Guide

This utility provides functions for masking sensitive data and validating admin email domains.

## Functions Available

### 1. PAN Masking
```typescript
import { maskPAN } from '@/utils/masking';

const pan = "ABCDE1234F";
const maskedPAN = maskPAN(pan);
// Result: "xxxxx1234F"
```

### 2. Email Masking
```typescript
import { maskEmail } from '@/utils/masking';

const email = "john.doe@gmail.com";
const maskedEmail = maskEmail(email);
// Result: "joxxxx@gmail.com"

const shortEmail = "ab@yahoo.com";
const maskedShortEmail = maskEmail(shortEmail);
// Result: "axxxx@yahoo.com"
```

### 3. Admin Email Validation
```typescript
import { validateAdminEmail, isAllowedAdminDomain } from '@/utils/masking';

// Validate email for admin roles
const validation = validateAdminEmail("user@nium.com");
if (!validation.isValid) {
  console.error(validation.error);
}

// Check if domain is allowed
const isValid = isAllowedAdminDomain("admin@instarem.co.in");
// Returns: true for allowed domains

// Allowed domains: instarem.co.in, nium.com, niumforex.com
```

### 4. Auto-Detection Masking
```typescript
import { maskData } from '@/utils/masking';

// Auto-detect and mask based on content
const result1 = maskData("ABCDE1234F"); // Detects as PAN
const result2 = maskData("user@gmail.com"); // Detects as email
const result3 = maskData("ABCDE1234F", 'pan'); // Force PAN masking
const result4 = maskData("user@gmail.com", 'email'); // Force email masking
```

## Use Cases

### In React Components
```typescript
import React from 'react';
import { maskPAN, maskEmail } from '@/utils/masking';

const UserInfoComponent = ({ user }) => {
  return (
    <div>
      <p>PAN: {maskPAN(user.panNumber)}</p>
      <p>Email: {maskEmail(user.email)}</p>
    </div>
  );
};
```

### In Form Validation
```typescript
import { validateAdminEmail } from '@/utils/masking';

const handleAdminUserCreation = (formData) => {
  const validation = validateAdminEmail(formData.email);
  if (!validation.isValid) {
    // Show error to user
    setError('email', validation.error);
    return;
  }
  // Proceed with user creation
};
```

### In Table Components
```typescript
import { maskPAN, maskEmail } from '@/utils/masking';

const columns = [
  {
    field: 'panNumber',
    headerName: 'PAN Number',
    valueGetter: (params) => maskPAN(params.value)
  },
  {
    field: 'email',
    headerName: 'Email',
    valueGetter: (params) => maskEmail(params.value)
  }
];
```

## Security Notes

1. **PAN Masking**: Only the last 4 characters are visible, all others are replaced with asterisks
2. **Email Masking**: 
   - For emails with 1-2 character local parts: First character + asterisks
   - For emails with 3+ character local parts: First 2 characters + asterisks
   - Domain is always fully visible for proper identification
3. **Admin Validation**: Only allows emails from instarem.co.in, nium.com, and niumforex.com domains

## Import Statement
```typescript
// Import individual functions
import { maskPAN, maskEmail, validateAdminEmail } from '@/utils/masking';

// Or import everything
import * as MaskingUtils from '@/utils/masking';