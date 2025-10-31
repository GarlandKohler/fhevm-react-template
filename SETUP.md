# Setup Guide

This guide will help you get started with the FHEVM SDK and example applications.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MetaMask** browser extension
- **Git** (for cloning the repository)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fhevm-react-template
```

### 2. Install All Dependencies

From the root directory, install all dependencies for the SDK and examples:

```bash
npm install
```

This will install dependencies for:
- The core FHEVM SDK package
- Next.js example application
- Confidential futures trading example
- Contract development tools

### 3. Build the SDK

Build the FHEVM SDK package:

```bash
npm run build:sdk
```

This compiles the TypeScript SDK into JavaScript modules that can be imported by the example applications.

## Running the Examples

### Option 1: Next.js Application

The Next.js example demonstrates modern React patterns with the FHEVM SDK.

```bash
# Navigate to the example
cd examples/nextjs-app

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**What you can do:**
- Connect MetaMask wallet
- Encrypt values using FHE
- See the SDK integration with React Context
- Experience type-safe development with TypeScript

### Option 2: Confidential Futures Trading

The futures trading example shows a real-world application with vanilla JavaScript.

```bash
# Navigate to the example
cd examples/confidential-futures-trading

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

**What you can do:**
- Create confidential futures contracts (owner only)
- Open long/short positions with encrypted values
- Query contract information
- Check settlement times
- Request withdrawals

## Contract Development

### 1. Compile Contracts

```bash
cd contracts
npx hardhat compile
```

### 2. Run Local Network

In a separate terminal:

```bash
npx hardhat node
```

This starts a local Ethereum network on `http://127.0.0.1:8545`

### 3. Deploy Contracts

Deploy to local network:

```bash
npm run deploy:local
```

Deploy to Sepolia testnet (requires configuration):

```bash
npm run deploy:sepolia
```

### 4. Run Tests

```bash
npm run test:contracts
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required for Sepolia deployment
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Custom gateway
GATEWAY_URL=https://gateway.fhevm.io

# Optional: Custom ACL address
ACL_ADDRESS=0x...
```

⚠️ **Security Warning**: Never commit your `.env` file or private keys to version control!

### Network Configuration

The SDK supports multiple networks. Configure in your application:

```typescript
const client = await createFhevmClient({
  provider,
  network: 'sepolia',  // or 'localhost', 'mainnet'
  gatewayUrl: process.env.GATEWAY_URL,  // optional
  aclAddress: process.env.ACL_ADDRESS   // optional
});
```

## Troubleshooting

### Common Issues

**1. Module not found errors**

```bash
# Clean install
npm run clean
npm install
npm run build:sdk
```

**2. MetaMask connection issues**

- Ensure MetaMask is installed
- Check you're on the correct network
- Try disconnecting and reconnecting

**3. Encryption failures**

- Verify the contract address is correct
- Ensure you're connected to the right network
- Check that the FHEVM keys are initialized

**4. TypeScript errors in examples**

```bash
# Rebuild SDK
cd packages/fhevm-sdk
npm run build
```

### Getting Help

If you encounter issues:

1. Check the [FAQ section](#faq)
2. Review example code in `examples/`
3. Check the SDK documentation in `packages/fhevm-sdk/README.md`
4. Open an issue on GitHub

## Development Workflow

### 1. Modify SDK

When making changes to the SDK:

```bash
cd packages/fhevm-sdk
# Edit files in src/
npm run build
# Test in examples
```

### 2. Test in Examples

After building the SDK, test changes in example applications:

```bash
cd examples/nextjs-app
npm run dev
```

### 3. Add New Examples

To add a new example:

1. Create directory in `examples/`
2. Add to workspace in root `package.json`
3. Add dependencies including `@fhevm/sdk`
4. Import and use the SDK

Example package.json:

```json
{
  "name": "my-example",
  "dependencies": {
    "@fhevm/sdk": "workspace:*",
    "ethers": "^6.9.0",
    "fhevmjs": "^0.5.0"
  }
}
```

## Production Deployment

### Build for Production

```bash
# Build SDK
npm run build:sdk

# Build Next.js example
cd examples/nextjs-app
npm run build
npm start
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Contracts deployed to target network
- [ ] SDK built and tested
- [ ] Network configuration verified
- [ ] Error handling implemented
- [ ] User permissions configured
- [ ] Security audit completed

### Recommended Hosting

- **Next.js**: Vercel, Netlify, AWS Amplify
- **Static Sites**: GitHub Pages, Netlify, Cloudflare Pages
- **Contracts**: Ethereum Mainnet, Polygon, Arbitrum

## Next Steps

After setup:

1. **Explore the Examples**: Run both example applications to see the SDK in action
2. **Read the Documentation**: Check `packages/fhevm-sdk/README.md` for detailed API docs
3. **Watch the Demo**: View `demo.mp4` for a complete walkthrough
4. **Build Your App**: Start integrating the SDK into your own project

## Quick Reference

### Common Commands

```bash
# Install everything
npm install

# Build SDK
npm run build:sdk

# Run Next.js example
npm run dev:nextjs

# Run futures example
npm run dev:futures

# Compile contracts
npm run compile:contracts

# Run contract tests
npm run test:contracts

# Deploy to local network
npm run deploy:local

# Deploy to Sepolia
npm run deploy:sepolia

# Clean all
npm run clean
```

### Directory Navigation

```bash
# SDK source code
cd packages/fhevm-sdk/src

# Next.js example
cd examples/nextjs-app

# Futures example
cd examples/confidential-futures-trading

# Contracts
cd contracts

# Deployment scripts
cd scripts
```

## FAQ

**Q: How do I use the SDK in my existing project?**

A: Install the dependencies and import the SDK:

```bash
npm install ethers fhevmjs
npm install /path/to/packages/fhevm-sdk
```

```typescript
import { createFhevmClient } from '@fhevm/sdk';
```

**Q: Can I use this with Vue or Angular?**

A: Yes! The SDK is framework-agnostic. Just don't import the React hooks.

**Q: Do I need to run a local node?**

A: No, you can connect to public networks like Sepolia. Local node is only needed for development.

**Q: How do I deploy my own contracts?**

A: Add your contracts to `contracts/`, compile with Hardhat, and deploy using the scripts in `scripts/`.

**Q: Is this production-ready?**

A: The SDK structure is production-ready. Ensure you conduct security audits before deploying to mainnet.

---

Ready to build confidential applications? Start with the [Quick Start](README.md#quick-start) guide!
