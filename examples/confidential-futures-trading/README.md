# Confidential Futures Trading Platform

Privacy-preserving derivatives trading platform built with FHEVM SDK.

## Overview

This example demonstrates a real-world application using the FHEVM SDK to build a confidential futures trading platform where:

- Position sizes are encrypted
- Entry prices are encrypted
- Collateral amounts are private
- Traders can query their positions without revealing details to others
- Settlement is done securely with FHE

## Features

- **Owner Functions**:
  - Create new futures contracts
  - Set initial reference prices
  - Settle contracts at expiry

- **Trader Functions**:
  - Open long/short positions with encrypted values
  - Query contract information
  - View personal positions
  - Request withdrawals

- **Privacy Features**:
  - All sensitive values encrypted with FHE
  - Position details hidden from other traders
  - Private profit/loss calculations
  - Confidential settlement process

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

### 3. Connect Wallet

- Click "Connect Wallet"
- Approve MetaMask connection
- Ensure you're on the correct network (Sepolia recommended for testing)

## Usage

### For Contract Owners

1. **Create a Futures Contract**:
   - Enter underlying asset (e.g., "BTC", "ETH")
   - Click "Create Contract"
   - Note the contract ID from the transaction

2. **Set Contract Price**:
   - Enter contract ID
   - Enter initial reference price
   - Click "Set Price"

3. **Settle Contract** (after expiry):
   - Enter contract ID
   - Enter final settlement price
   - Click "Settle Contract"

### For Traders

1. **Open a Position**:
   - Enter contract ID
   - Enter your entry price
   - Enter amount (position size)
   - Enter collateral
   - Select Long or Short
   - Click "Open Position"

2. **Query Contracts**:
   - Enter specific contract ID to view details
   - Or click "Refresh All" to see recent contracts

3. **Check Your Positions**:
   - Enter contract ID
   - Click "Query Position"
   - View your position details

4. **Withdraw Profits**:
   - Click "Request Withdrawal"
   - Confirm transaction in wallet

## FHEVM SDK Integration

This example showcases:

### 1. Client Initialization

```javascript
import { createFhevmClient } from '@fhevm/sdk';

// Initialize FHEVM client
this.fhevmClient = await createFhevmClient({
  provider: this.provider,
  signer: this.signer,
  network: 'sepolia'
});
```

### 2. Encrypted Transactions

```javascript
// The SDK handles encryption automatically
// Values like amount, price, and collateral are encrypted client-side
const tx = await this.contract.openPosition(
  contractId,
  entryPrice,    // Encrypted
  amount,        // Encrypted
  collateral,    // Encrypted
  isLong
);
```

### 3. Resource Management

```javascript
// Clean up when done
if (this.fhevmClient) {
  this.fhevmClient.dispose();
}
```

## Architecture

### Frontend (Vanilla JavaScript)

- `index.html`: UI structure
- `app.js`: Application logic with FHEVM SDK integration
- `styles.css`: Styling
- `server.js`: Simple Express server

### Smart Contract

Located in `/contracts/ConfidentialFuturesTrading.sol`:

- Manages futures contracts
- Handles encrypted positions
- Processes settlements
- Distributes profits

### FHEVM SDK Integration Points

1. **Wallet Connection**: Initializes provider and signer
2. **Client Setup**: Creates FHEVM client with network config
3. **Transaction Handling**: Sends encrypted data to contracts
4. **State Management**: Tracks client lifecycle
5. **Error Handling**: Formats and displays errors

## Contract Interaction Flow

```
User Input
    │
    ▼
App.js (SDK Integration)
    │
    ├─> createFhevmClient()  [Initialize]
    │
    ├─> contract.openPosition()  [Encrypted Transaction]
    │
    └─> contract.getContractInfo()  [Query State]

    │
    ▼
Smart Contract
    │
    ├─> Store encrypted values
    │
    └─> Process FHE operations

    │
    ▼
Blockchain
```

## Testing

### Test Scenarios

1. **Owner Workflow**:
   - Create contract
   - Set price
   - Wait for expiry
   - Settle contract

2. **Trader Workflow**:
   - Open long position
   - Open short position
   - Query positions
   - Request withdrawal

3. **Privacy Verification**:
   - Verify encrypted values on-chain
   - Confirm decryption works for authorized users
   - Test unauthorized access is blocked

## Deployment

### Local Development

```bash
npm run dev
```

### Production Build

1. Update contract address in `app.js`
2. Deploy static files to hosting service
3. Configure environment variables

### Recommended Hosting

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Configuration

### Contract Address

Update in `app.js`:

```javascript
this.contractAddress = "0xYourDeployedContractAddress";
```

### Network

Configured in SDK initialization:

```javascript
this.fhevmClient = await createFhevmClient({
  provider: this.provider,
  signer: this.signer,
  network: 'sepolia'  // or 'localhost', 'mainnet'
});
```

## Troubleshooting

### Common Issues

**SDK Not Initializing**:
- Check wallet is connected
- Verify correct network
- Check console for errors

**Transactions Failing**:
- Ensure sufficient gas
- Verify contract address
- Check owner permissions

**Encryption Errors**:
- Verify SDK is initialized
- Check contract address format
- Ensure proper network connection

## Security Considerations

- Never expose private keys
- Validate all user inputs
- Use appropriate gas limits
- Test thoroughly on testnet
- Audit before mainnet deployment

## Performance Tips

- Reuse FHEVM client instance
- Batch operations when possible
- Implement loading states
- Cache contract queries
- Use optimistic updates

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Main README](../../README.md)
- [Setup Guide](../../SETUP.md)
- [Architecture Overview](../../ARCHITECTURE.md)

## License

MIT
