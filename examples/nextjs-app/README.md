# FHEVM SDK Next.js Example

Modern Next.js 14 application demonstrating FHEVM SDK integration with App Router.

## Overview

This example shows how to integrate the FHEVM SDK into a Next.js application using:

- Next.js 14 with App Router
- React Context for state management
- TypeScript for type safety
- Modern CSS Modules for styling
- Client-side FHE operations

## Features

- ✓ Wallet connection with MetaMask
- ✓ FHEVM client initialization
- ✓ Value encryption demonstration
- ✓ React Context pattern
- ✓ Loading states and error handling
- ✓ Responsive design
- ✓ TypeScript type safety

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Open Browser

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
nextjs-app/
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout
│       ├── page.tsx            # Home page
│       ├── page.module.css     # Page styles
│       ├── globals.css         # Global styles
│       └── providers.tsx       # FHEVM Context Provider
├── next.config.js              # Next.js configuration
├── package.json
└── tsconfig.json
```

## Key Components

### 1. FHEVM Context Provider

Located in `src/app/providers.tsx`:

```typescript
export function FhevmProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connect = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const client = await createFhevmClient({
      provider,
      network: 'sepolia'
    });
    setClient(client);
  };

  return (
    <FhevmContext.Provider value={{ client, connect, ... }}>
      {children}
    </FhevmContext.Provider>
  );
}
```

### 2. Main Page

Located in `src/app/page.tsx`:

Demonstrates:
- Wallet connection
- Value encryption
- Result display
- Error handling

### 3. Layout

Located in `src/app/layout.tsx`:

Wraps application with FHEVM provider:

```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FhevmProvider>{children}</FhevmProvider>
      </body>
    </html>
  );
}
```

## FHEVM SDK Integration

### Client Initialization

```typescript
'use client';

import { createFhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
const client = await createFhevmClient({
  provider,
  signer: await provider.getSigner(),
  network: 'sepolia'
});
```

### Encryption Example

```typescript
const handleEncrypt = async () => {
  if (!client || !userAddress) return;

  const value = parseInt(encryptValue);
  const encrypted = await client.encryption.encryptU32(value, {
    contract: contractAddress,
    userAddress
  });

  setEncryptedResult(JSON.stringify(encrypted, null, 2));
};
```

### Using the Hook

```typescript
const { client, isLoading, connect, userAddress } = useFhevm();

// Connect wallet
await connect();

// Use client
const encrypted = await client.encryption.encryptU32(42, options);
```

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Adding New Features

1. **New Pages**: Create files in `src/app/`
2. **Components**: Create in `src/components/`
3. **Styles**: Use CSS Modules or global styles
4. **API Routes**: Create in `src/app/api/`

## Configuration

### Contract Address

Update the contract address in `src/app/page.tsx`:

```typescript
const [contractAddress, setContractAddress] = useState(
  '0xYourContractAddress'
);
```

Or use environment variables:

```typescript
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_GATEWAY_URL=https://gateway.fhevm.io
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub

2. Import repository in Vercel

3. Configure environment variables

4. Deploy

### Manual Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Static Export (Optional)

For static hosting:

1. Update `next.config.js`:
```javascript
module.exports = {
  output: 'export'
};
```

2. Build:
```bash
npm run build
```

3. Deploy `out/` directory

## Features Demonstrated

### 1. React Context Pattern

Centralized state management for FHEVM client:

```typescript
const { client, connect, disconnect, userAddress } = useFhevm();
```

### 2. Client-Side Rendering

FHEVM operations marked with `'use client'`:

```typescript
'use client';

import { useFhevm } from './providers';
```

### 3. Type Safety

Full TypeScript support:

```typescript
import type { FhevmClient } from '@fhevm/sdk';

const [client, setClient] = useState<FhevmClient | null>(null);
```

### 4. Error Handling

Comprehensive error handling:

```typescript
try {
  const encrypted = await client.encryption.encryptU32(value, options);
  setEncryptedResult(encrypted);
} catch (error) {
  console.error('Encryption failed:', error);
  alert('Encryption failed: ' + (error as Error).message);
}
```

### 5. Loading States

User feedback during operations:

```typescript
const [isEncrypting, setIsEncrypting] = useState(false);

const handleEncrypt = async () => {
  setIsEncrypting(true);
  try {
    // ... encryption logic
  } finally {
    setIsEncrypting(false);
  }
};
```

## Best Practices

### 1. Client Initialization

Initialize once and reuse:

```typescript
useEffect(() => {
  if (!config) return;

  createFhevmClient(config).then(setClient);

  return () => {
    if (client) {
      client.dispose();
    }
  };
}, [config]);
```

### 2. Error Boundaries

Wrap components with error boundaries:

```typescript
<ErrorBoundary fallback={<ErrorDisplay />}>
  <YourComponent />
</ErrorBoundary>
```

### 3. Memoization

Memoize expensive operations:

```typescript
const encrypted = useMemo(
  () => client?.encryption.encryptU32(value, options),
  [client, value, options]
);
```

## Troubleshooting

### Common Issues

**1. Hydration Errors**

Ensure dynamic imports for browser-only code:

```typescript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(
  () => import('./component'),
  { ssr: false }
);
```

**2. Window is not defined**

Check for window before using:

```typescript
if (typeof window !== 'undefined' && window.ethereum) {
  // Use window.ethereum
}
```

**3. Module Resolution**

Verify `tsconfig.json` paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Main README](../../README.md)
- [Setup Guide](../../SETUP.md)

## License

MIT
