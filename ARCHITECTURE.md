# Architecture Overview

This document describes the architecture of the FHEVM SDK and how the different components work together.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  (Next.js, React, Vue, Vanilla JS, Node.js, etc.)           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ imports
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    FHEVM SDK (@fhevm/sdk)                    │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Client    │  │  Encryption  │  │   Decryption    │   │
│  │  Manager    │  │   Service    │  │    Service      │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Contract   │  │    React     │  │   Utilities     │   │
│  │   Helper    │  │    Hooks     │  │                 │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└────────────────────┬───────────────────┬────────────────────┘
                     │                   │
                     │ uses              │ uses
                     ▼                   ▼
┌────────────────────────────┐  ┌──────────────────────┐
│      fhevmjs Library       │  │    ethers.js         │
│  (FHE Operations)          │  │  (Web3 Provider)     │
└────────────────────────────┘  └──────────────────────┘
                     │                   │
                     │                   │
                     ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                          │
│     (Ethereum, Polygon, or other EVM chains)                │
│                                                               │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │  FHEVM Smart         │    │  Gateway Service     │      │
│  │  Contracts           │    │  (Decryption)        │      │
│  └──────────────────────┘    └──────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. FhevmClient

The main entry point for all SDK operations.

**Responsibilities:**
- Manages client lifecycle
- Initializes encryption and decryption services
- Maintains connection to blockchain provider
- Provides unified interface for all operations

**Key Methods:**
- `initialize()`: Sets up FHE keys and services
- `getState()`: Returns current client state
- `dispose()`: Cleans up resources

**Usage:**
```typescript
const client = await createFhevmClient({
  provider: browserProvider,
  network: 'sepolia'
});
```

### 2. Encryption Service

Handles encryption of plaintext values into FHE ciphertexts.

**Responsibilities:**
- Initialize FHE encryption keys
- Provide encryption functions for different types
- Create encrypted inputs for contracts
- Manage encryption state

**Key Methods:**
- `encryptU8/U16/U32/U64()`: Encrypt unsigned integers
- `encryptBool()`: Encrypt boolean values
- `createEncryptedInput()`: Create input container
- `getPublicKey()`: Get FHE public key

**Flow:**
```
Plaintext Value
      │
      ▼
[encryptU32(42)]
      │
      ▼
FHE Public Key + Value
      │
      ▼
Encrypted Handle + Proof
      │
      ▼
Send to Smart Contract
```

### 3. Decryption Service

Handles decryption of FHE ciphertexts back to plaintext.

**Responsibilities:**
- User decryption with EIP-712 signatures
- Public decryption for non-sensitive values
- Batch decryption operations
- Gateway communication

**Key Methods:**
- `userDecrypt()`: Decrypt with signature
- `publicDecrypt()`: Decrypt public values
- `batchUserDecrypt()`: Decrypt multiple values

**User Decryption Flow:**
```
Encrypted Handle
      │
      ▼
[userDecrypt()]
      │
      ▼
Create EIP-712 Message
      │
      ▼
Request Wallet Signature
      │
      ▼
Send to Gateway
      │
      ▼
Decrypted Value
```

### 4. Contract Helper

Simplifies interactions with FHEVM smart contracts.

**Responsibilities:**
- Create contract instances
- Send encrypted transactions
- Call view functions
- Handle transaction receipts

**Key Methods:**
- `createContract()`: Instantiate contract
- `sendEncryptedTransaction()`: Send tx with encrypted data
- `callView()`: Query contract state

### 5. React Hooks (Optional)

Provides React-specific integrations.

**Available Hooks:**
- `useFhevmClient`: Manage client lifecycle
- `useFhevmEncrypt`: Encryption operations
- `useFhevmDecrypt`: Decryption operations

**Benefits:**
- Automatic cleanup
- Loading states
- Error handling
- React-friendly API

## Data Flow

### Encryption Flow

```
User Input (42)
      │
      ▼
Application calls:
client.encryption.encryptU32(42, options)
      │
      ▼
SDK creates encrypted input:
- Gets FHE public key
- Encrypts value
- Generates proof
      │
      ▼
Returns: {
  handles: ['0xabc...'],
  inputProof: '0xdef...'
}
      │
      ▼
Application sends to contract:
contract.submitValue(handle, proof)
      │
      ▼
Contract processes encrypted value
```

### Decryption Flow

```
Contract has encrypted value (handle)
      │
      ▼
Application requests decryption:
client.decryption.userDecrypt({
  contractAddress,
  userAddress,
  handle
})
      │
      ▼
SDK creates EIP-712 message
      │
      ▼
User signs with wallet
      │
      ▼
SDK sends to gateway:
- Handle
- Contract address
- User address
- Signature
      │
      ▼
Gateway verifies and decrypts
      │
      ▼
Returns plaintext value
      │
      ▼
Application displays: 42
```

## Security Architecture

### Key Management

1. **FHE Public Key**:
   - Generated by FHEVM network
   - Fetched during initialization
   - Used for all encryptions
   - No private key on client

2. **Wallet Private Key**:
   - Managed by user's wallet (MetaMask)
   - Never exposed to SDK
   - Used for transaction signing only

3. **Decryption Keys**:
   - Managed by gateway service
   - Require EIP-712 signatures
   - Permission-based access

### Permission Model

```
┌───────────────────────────────────────┐
│         Smart Contract ACL            │
│  (Access Control List)                │
├───────────────────────────────────────┤
│ Address → Permissions                 │
│ 0xUser1 → [Read own data]            │
│ 0xUser2 → [Read own data]            │
│ 0xOwner → [Read all, Write]          │
└───────────────────────────────────────┘
           │
           │ enforces
           ▼
┌───────────────────────────────────────┐
│      Gateway Service                  │
│  (Decryption Authorization)           │
├───────────────────────────────────────┤
│ Verifies:                             │
│ - Signature validity                  │
│ - ACL permissions                     │
│ - Request authenticity                │
└───────────────────────────────────────┘
```

## Network Architecture

### Component Communication

```
┌─────────────┐         HTTPS           ┌─────────────┐
│  Frontend   │ ──────────────────────> │   Gateway   │
│    App      │                          │   Service   │
└──────┬──────┘                          └─────────────┘
       │                                        │
       │ JSON-RPC                              │
       │                                        │
       ▼                                        │
┌─────────────┐                                │
│   RPC Node  │ <──────────────────────────────┘
│  (Infura/   │         Query State
│  Alchemy)   │
└──────┬──────┘
       │
       │ Read/Write
       │
       ▼
┌─────────────┐
│  Blockchain │
│  (Ethereum) │
└─────────────┘
```

### Network Configurations

**Localhost (Development)**
- RPC: http://127.0.0.1:8545
- Chain ID: 31337
- Gateway: Local or mocked

**Sepolia (Testnet)**
- RPC: https://sepolia.infura.io/v3/...
- Chain ID: 11155111
- Gateway: https://gateway.fhevm.io (testnet)

**Mainnet (Production)**
- RPC: https://mainnet.infura.io/v3/...
- Chain ID: 1
- Gateway: https://gateway.fhevm.io (mainnet)

## State Management

### Client State

```typescript
interface FhevmClientState {
  isInitialized: boolean;    // SDK ready?
  network: string;            // Which network?
  userAddress?: string;       // Connected wallet?
  hasKeys: boolean;           // FHE keys loaded?
}
```

### Lifecycle

```
Created → Initializing → Ready → Disposed
   │           │          │         │
   │           │          │         └─> cleanup()
   │           │          └──────────> operations
   │           └──────────────────> setup keys
   └──────────────────────────────> new FhevmClient()
```

## Error Handling

### Error Categories

1. **Connection Errors**
   - Wallet not found
   - Network mismatch
   - RPC failure

2. **Encryption Errors**
   - Invalid input type
   - Keys not initialized
   - Contract address invalid

3. **Transaction Errors**
   - User rejected
   - Insufficient gas
   - Contract revert

4. **Decryption Errors**
   - Signature rejected
   - Permission denied
   - Gateway unavailable

### Error Flow

```
Error Occurs
      │
      ▼
SDK catches and formats
      │
      ▼
Returns structured error:
{
  code: number,
  message: string,
  details?: any
}
      │
      ▼
Application handles:
- Display to user
- Retry logic
- Fallback behavior
```

## Performance Considerations

### Optimization Strategies

1. **Client Initialization**
   - Cache FHE keys
   - Reuse client instances
   - Lazy load services

2. **Encryption**
   - Batch operations when possible
   - Reuse encrypted inputs
   - Minimize key fetches

3. **Decryption**
   - Batch decrypt multiple values
   - Cache recent decryptions
   - Implement loading states

4. **Contract Calls**
   - Use view functions when possible
   - Batch similar operations
   - Implement optimistic updates

### Bundle Size

```
Core SDK: ~50KB (gzipped)
+ fhevmjs: ~200KB
+ ethers: ~100KB
──────────────────
Total: ~350KB
```

**Optimization:**
- Tree-shaking enabled
- Optional hooks separate
- No unnecessary dependencies

## Extensibility

### Adding New Features

1. **New Encryption Types**
```typescript
// In encryption.ts
async encryptAddress(
  address: string,
  options: EncryptOptions
): Promise<EncryptedInput> {
  // Implementation
}
```

2. **Custom Contract Helpers**
```typescript
// In contract.ts
async callWithRetry(
  contract: Contract,
  method: string,
  retries: number = 3
): Promise<any> {
  // Implementation
}
```

3. **Framework Adapters**
```typescript
// New file: vue.ts
export function useVueFhevm(config) {
  // Vue 3 composition API integration
}
```

## Testing Strategy

### Unit Tests

- Individual service methods
- Utility functions
- Type validations

### Integration Tests

- Client initialization
- End-to-end encryption
- Contract interactions

### E2E Tests

- Full user workflows
- Cross-browser testing
- Network conditions

## Deployment Architecture

### Development

```
Local Machine
  └─> Hardhat Node (contracts)
  └─> Next.js Dev Server (frontend)
  └─> Mock Gateway (optional)
```

### Staging

```
Sepolia Testnet
  └─> Deployed Contracts
  └─> Vercel Preview (frontend)
  └─> Test Gateway
```

### Production

```
Ethereum Mainnet
  └─> Verified Contracts
  └─> Vercel Production (frontend)
  └─> Production Gateway
  └─> CDN (static assets)
  └─> Monitoring (Sentry, Analytics)
```

## Future Enhancements

### Planned Features

1. **Advanced Caching**
   - Persistent key storage
   - Encrypted value cache
   - Optimistic updates

2. **Additional Integrations**
   - Vue composition API
   - Angular services
   - Svelte stores

3. **Developer Tools**
   - Browser extension
   - CLI for testing
   - VS Code extension

4. **Performance**
   - WebAssembly optimizations
   - Worker thread support
   - Progressive loading

---

For questions about the architecture, please open an issue or discussion on GitHub.
