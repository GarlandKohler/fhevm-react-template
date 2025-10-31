# FHEVM SDK

Universal SDK for building confidential frontends with Fully Homomorphic Encryption (FHE).

## Features

- **Framework Agnostic**: Works with React, Vue, Next.js, Node.js, or any frontend setup
- **Unified API**: Single, consistent interface for all FHE operations
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Easy Integration**: Minimal setup required, < 10 lines of code to get started
- **React Hooks**: Optional hooks for React applications
- **Modular Design**: Import only what you need

## Installation

```bash
npm install @fhevm/sdk ethers fhevmjs
```

## Quick Start

### Basic Usage (< 10 lines)

```typescript
import { createFhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

// Initialize client
const provider = new BrowserProvider(window.ethereum);
const client = await createFhevmClient({ provider, network: 'sepolia' });

// Encrypt a value
const encrypted = await client.encryption.encryptU32(42, {
  contract: contractAddress,
  userAddress: await provider.getSigner().getAddress()
});

// Decrypt a value
const decrypted = await client.decryption.userDecrypt({
  contractAddress,
  userAddress,
  handle: encryptedHandle
});
```

### React Example

```tsx
import { useFhevmClient, useFhevmEncrypt } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

function MyComponent() {
  const provider = new BrowserProvider(window.ethereum);
  const { client, isLoading } = useFhevmClient({ provider, network: 'sepolia' });
  const { encryptU32, isEncrypting } = useFhevmEncrypt(client);

  const handleEncrypt = async () => {
    const encrypted = await encryptU32(42, { contract, userAddress });
    // Use encrypted data...
  };

  return <button onClick={handleEncrypt} disabled={isEncrypting}>Encrypt</button>;
}
```

### Next.js Example

```typescript
// app/providers.tsx
'use client';

import { createFhevmClient } from '@fhevm/sdk';
import { createContext, useContext, useEffect, useState } from 'react';

const FhevmContext = createContext(null);

export function FhevmProvider({ children }) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    async function init() {
      const provider = new BrowserProvider(window.ethereum);
      const client = await createFhevmClient({ provider, network: 'sepolia' });
      setClient(client);
    }
    init();
  }, []);

  return <FhevmContext.Provider value={client}>{children}</FhevmContext.Provider>;
}

export const useFhevm = () => useContext(FhevmContext);
```

## API Reference

### Client Creation

```typescript
import { createFhevmClient, FhevmClient } from '@fhevm/sdk';

const client: FhevmClient = await createFhevmClient({
  provider: BrowserProvider,
  signer?: Signer,
  network?: 'localhost' | 'sepolia' | 'mainnet',
  gatewayUrl?: string,
  aclAddress?: string
});
```

### Encryption

```typescript
// Encrypt different types
const encryptedU8 = await client.encryption.encryptU8(value, options);
const encryptedU16 = await client.encryption.encryptU16(value, options);
const encryptedU32 = await client.encryption.encryptU32(value, options);
const encryptedU64 = await client.encryption.encryptU64(value, options);
const encryptedBool = await client.encryption.encryptBool(value, options);
```

### Decryption

```typescript
// User decryption (requires signature)
const result = await client.decryption.userDecrypt({
  contractAddress,
  userAddress,
  handle: encryptedHandle
});

// Public decryption
const result = await client.decryption.publicDecrypt(
  contract,
  'getPublicValue',
  arg1, arg2
);

// Batch decryption
const results = await client.decryption.batchUserDecrypt([
  { contractAddress, userAddress, handle: handle1 },
  { contractAddress, userAddress, handle: handle2 }
]);
```

### React Hooks

```typescript
// Client hook
const { client, isLoading, error } = useFhevmClient(config);

// Encryption hook
const { encryptU32, encryptU64, encryptBool, isEncrypting, error } = useFhevmEncrypt(client);

// Decryption hook
const { userDecrypt, isDecrypting, error } = useFhevmDecrypt(client);
```

## Examples

See the `/examples` directory for complete applications:

- `nextjs-app` - Full Next.js 14 application with App Router
- `confidential-futures-trading` - Real-world trading platform example
- `vue-app` - Vue 3 example (optional)
- `node-script` - Pure Node.js example (optional)

## License

MIT
