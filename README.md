# FHEVM SDK - Universal Confidential Frontend Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Built with Zama](https://img.shields.io/badge/Built%20with-Zama-brightgreen)](https://www.zama.ai/)

> Universal SDK for building confidential frontends with Fully Homomorphic Encryption (FHE). Framework-agnostic, developer-friendly, and production-ready.

## 🎯 Overview

This project provides a **next-generation FHEVM SDK** that makes building confidential applications simple, consistent, and intuitive for developers. Whether you're using React, Vue, Next.js, or vanilla JavaScript, the SDK provides a unified interface for all FHE operations.

### Why This SDK?

- **Framework Agnostic**: Works seamlessly with any frontend framework or Node.js
- **Unified API**: Single, consistent interface inspired by wagmi
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Easy Integration**: Get started with less than 10 lines of code
- **Battle Tested**: Includes real-world example applications
- **Modular Design**: Import only what you need

## 🚀 Quick Start

### Installation

```bash
# Install from workspace root
npm install

# Or install SDK only
cd packages/fhevm-sdk
npm install
npm run build
```

### Basic Usage (< 10 lines!)

```typescript
import { createFhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

// 1. Create provider
const provider = new BrowserProvider(window.ethereum);

// 2. Initialize FHEVM client
const client = await createFhevmClient({
  provider,
  network: 'sepolia'
});

// 3. Encrypt a value
const encrypted = await client.encryption.encryptU32(42, {
  contract: contractAddress,
  userAddress: await provider.getSigner().getAddress()
});

// 4. Use encrypted data in transactions
await contract.submitEncryptedValue(encrypted.handles[0], encrypted.inputProof);
```

That's it! You're now using FHE in your application.

## 📦 Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Core SDK package
│       ├── src/
│       │   ├── client.ts       # Main client
│       │   ├── encryption.ts   # Encryption service
│       │   ├── decryption.ts   # Decryption service
│       │   ├── contract.ts     # Contract helper
│       │   ├── hooks.ts        # React hooks (optional)
│       │   ├── types.ts        # TypeScript definitions
│       │   └── utils.ts        # Utility functions
│       └── package.json
├── examples/
│   ├── nextjs-app/             # Next.js 14 example
│   │   ├── src/app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── providers.tsx   # FHEVM context provider
│   │   └── package.json
│   └── confidential-futures-trading/  # Real-world trading platform
│       ├── index.html
│       ├── app.js              # Vanilla JS with SDK
│       └── package.json
├── contracts/                  # Solidity contracts
├── scripts/                    # Deployment scripts
├── demo.mp4                    # Video demonstration
└── README.md
```

## 🎨 Examples

### 1. Next.js Application

A complete Next.js 14 application using App Router with the FHEVM SDK.

**Location**: `examples/nextjs-app/`

**Features**:
- React Context for FHEVM client management
- Wallet connection with MetaMask
- Real-time encryption/decryption
- TypeScript type safety
- Modern UI with CSS modules

**Run**:
```bash
cd examples/nextjs-app
npm install
npm run dev
```

Visit `http://localhost:3000`

### 2. Confidential Futures Trading Platform

A real-world example demonstrating a privacy-preserving derivatives trading platform.

**Location**: `examples/confidential-futures-trading/`

**Features**:
- Create and trade confidential futures contracts
- Encrypted position sizes and prices
- Owner functions for contract management
- Position querying and settlement
- Vanilla JavaScript implementation with SDK

**Run**:
```bash
cd examples/confidential-futures-trading
npm install
npm run dev
```

Visit `http://localhost:3001`

## 📚 SDK API Reference

### Client Initialization

```typescript
import { createFhevmClient, FhevmClient } from '@fhevm/sdk';

const client: FhevmClient = await createFhevmClient({
  provider: BrowserProvider,      // ethers.js provider
  signer?: Signer,                // Optional signer
  network?: string,               // 'localhost', 'sepolia', 'mainnet'
  gatewayUrl?: string,            // Custom gateway URL
  aclAddress?: string             // Custom ACL address
});
```

### Encryption Operations

```typescript
// Encrypt different integer types
const encrypted8 = await client.encryption.encryptU8(value, options);
const encrypted16 = await client.encryption.encryptU16(value, options);
const encrypted32 = await client.encryption.encryptU32(value, options);
const encrypted64 = await client.encryption.encryptU64(value, options);

// Encrypt boolean
const encryptedBool = await client.encryption.encryptBool(true, options);

// Options
const options = {
  contract: contractAddress,    // Contract address or Contract instance
  userAddress: signerAddress    // User's wallet address
};
```

### Decryption Operations

```typescript
// User decryption (requires EIP-712 signature)
const result = await client.decryption.userDecrypt({
  contractAddress: '0x...',
  userAddress: '0x...',
  handle: encryptedHandle
});

// Public decryption (no signature required)
const publicResult = await client.decryption.publicDecrypt(
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

### React Hooks (Optional)

```typescript
import { useFhevmClient, useFhevmEncrypt, useFhevmDecrypt } from '@fhevm/sdk';

function MyComponent() {
  // Client management
  const { client, isLoading, error } = useFhevmClient(config);

  // Encryption
  const { encryptU32, isEncrypting } = useFhevmEncrypt(client);

  // Decryption
  const { userDecrypt, isDecrypting } = useFhevmDecrypt(client);

  const handleEncrypt = async () => {
    const encrypted = await encryptU32(42, { contract, userAddress });
    // Use encrypted data...
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

### Contract Helper

```typescript
import { ContractHelper } from '@fhevm/sdk';

const helper = new ContractHelper(client);

// Create contract instance
const contract = helper.createContract(address, abi, signer);

// Send encrypted transaction
const receipt = await helper.sendEncryptedTransaction(
  contract,
  'submitValue',
  encryptedInput,
  ...additionalArgs
);

// Call view function
const value = await helper.callView(contract, 'getValue', arg1);
```

## 🔧 Development

### Build SDK

```bash
cd packages/fhevm-sdk
npm install
npm run build
```

### Run Tests

```bash
npm test
```

### Development Mode

```bash
npm run dev
```

## 🏗️ Contract Development

### Compile Contracts

```bash
cd contracts
npx hardhat compile
```

### Deploy Contracts

```bash
# Local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

### Run Tests

```bash
npx hardhat test
```

## 📖 Documentation

### SDK Documentation

Detailed SDK documentation is available in `packages/fhevm-sdk/README.md`

### Example Walkthroughs

Each example includes its own README with setup instructions and explanations.

### Video Demonstration

Watch `demo.mp4` for a complete walkthrough of the SDK features and example applications.

## 🎯 Key Features

### 1. Framework Agnostic

The SDK works with any JavaScript environment:

```typescript
// React
import { useFhevmClient } from '@fhevm/sdk';

// Vue
import { createFhevmClient } from '@fhevm/sdk';

// Node.js
const { createFhevmClient } = require('@fhevm/sdk');

// Vanilla JS
import { createFhevmClient } from '@fhevm/sdk';
```

### 2. Unified API

Consistent interface across all operations:

```typescript
// All encryption functions follow the same pattern
client.encryption.encryptU8(value, options)
client.encryption.encryptU16(value, options)
client.encryption.encryptU32(value, options)
client.encryption.encryptU64(value, options)
client.encryption.encryptBool(value, options)

// All decryption functions follow the same pattern
client.decryption.userDecrypt(request)
client.decryption.publicDecrypt(contract, method, ...args)
client.decryption.batchUserDecrypt(requests)
```

### 3. Type Safety

Full TypeScript support with intellisense:

```typescript
import type {
  FhevmClient,
  FhevmConfig,
  EncryptedInput,
  DecryptionRequest,
  DecryptionResult
} from '@fhevm/sdk';
```

### 4. Error Handling

Built-in error handling and formatting:

```typescript
import { formatError } from '@fhevm/sdk';

try {
  await client.encryption.encryptU32(value, options);
} catch (error) {
  console.error(formatError(error));
}
```

## 🌟 Use Cases

This SDK is perfect for building:

- **DeFi Applications**: Private trading, confidential lending
- **Healthcare**: Encrypted medical records, private health data
- **Voting Systems**: Secret ballot voting on blockchain
- **Gaming**: Hidden information games, confidential player stats
- **Supply Chain**: Private business logic, confidential pricing
- **Identity**: Private credentials, selective disclosure

## 📋 Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- MetaMask or compatible Web3 wallet
- Modern browser with ES2020 support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Website](https://www.zama.ai/)
- [fhevmjs Library](https://github.com/zama-ai/fhevmjs)

## 🙏 Acknowledgments

Built on top of Zama's FHEVM technology. Special thanks to the Zama team for making FHE accessible to developers.

## 📞 Support

For questions and support:
- GitHub Issues: Create an issue in this repository
- Zama Discord: Join the Zama community

---

**Built with ❤️ using FHEVM**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
