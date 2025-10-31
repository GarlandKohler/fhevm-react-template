# Deployment Guide

This guide covers deploying the FHEVM SDK examples and smart contracts to various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Contract Deployment](#contract-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Production Considerations](#production-considerations)

## Prerequisites

### Required

- Node.js >= 18.0.0
- npm >= 9.0.0
- Wallet with testnet/mainnet ETH
- RPC endpoint (Infura, Alchemy, or custom)

### Recommended

- Etherscan API key for contract verification
- Domain name for frontend hosting
- SSL certificate (provided by most hosting platforms)

## Contract Deployment

### 1. Configure Environment

Create a `.env` file in the project root:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **Security**: Never commit your `.env` file or share your private key!

### 2. Compile Contracts

```bash
npx hardhat compile
```

This generates:
- Compiled bytecode in `artifacts/`
- TypeChain types in `typechain-types/`
- ABI files for frontend integration

### 3. Deploy to Local Network

Start local Hardhat node:

```bash
npx hardhat node
```

In another terminal:

```bash
npm run deploy:local
```

### 4. Deploy to Sepolia Testnet

Ensure you have Sepolia ETH in your wallet:

```bash
npm run deploy:sepolia
```

The deployment script will:
- Deploy the ConfidentialFuturesTrading contract
- Output the contract address
- Save deployment info to `deployments/`

### 5. Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### 6. Update Frontend Configuration

After deployment, update the contract address in your frontend:

**For Next.js example:**
```typescript
// examples/nextjs-app/src/config.ts
export const CONTRACT_ADDRESS = '0xYourDeployedAddress';
```

**For Futures Trading example:**
```javascript
// examples/confidential-futures-trading/app.js
this.contractAddress = "0xYourDeployedAddress";
```

## Frontend Deployment

### Next.js Application

#### Option 1: Vercel (Recommended)

1. Push your code to GitHub

2. Visit [vercel.com](https://vercel.com)

3. Import your repository

4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. Add environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_NETWORK=sepolia
   ```

6. Deploy

#### Option 2: Netlify

1. Build the project:
   ```bash
   cd examples/nextjs-app
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

#### Option 3: Self-Hosted

1. Build for production:
   ```bash
   cd examples/nextjs-app
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

3. Configure reverse proxy (nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Confidential Futures Trading

#### Option 1: Static Hosting (GitHub Pages, Netlify)

1. The example uses vanilla JavaScript and can be hosted as static files

2. Build/copy files:
   ```bash
   cd examples/confidential-futures-trading
   # Files: index.html, app.js, styles.css
   ```

3. Deploy to GitHub Pages:
   ```bash
   # Push to gh-pages branch
   git subtree push --prefix examples/confidential-futures-trading origin gh-pages
   ```

4. Configure custom domain (optional)

#### Option 2: Express Server

1. The example includes an Express server:
   ```bash
   cd examples/confidential-futures-trading
   npm start
   ```

2. Deploy to platforms like:
   - Heroku
   - Railway
   - DigitalOcean App Platform
   - AWS Elastic Beanstalk

Example Heroku deployment:
```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

## Production Considerations

### Security

#### Smart Contracts

- [ ] Complete security audit
- [ ] Test on testnet extensively
- [ ] Set up monitoring and alerts
- [ ] Implement emergency pause functionality
- [ ] Use multi-sig for owner functions
- [ ] Set appropriate gas limits

#### Frontend

- [ ] Never expose private keys in frontend code
- [ ] Validate all user inputs
- [ ] Implement rate limiting
- [ ] Use HTTPS only
- [ ] Set appropriate CORS policies
- [ ] Implement CSP headers
- [ ] Regular dependency updates

### Performance

#### Smart Contracts

- [ ] Optimize gas usage
- [ ] Batch operations where possible
- [ ] Use events for off-chain indexing
- [ ] Consider layer 2 solutions

#### Frontend

- [ ] Enable production builds
- [ ] Implement code splitting
- [ ] Optimize bundle size
- [ ] Use CDN for static assets
- [ ] Implement caching strategies
- [ ] Monitor performance metrics

### Monitoring

#### Recommended Tools

- **Contract Monitoring**:
  - Tenderly
  - Defender (OpenZeppelin)
  - Etherscan alerts

- **Frontend Monitoring**:
  - Sentry for error tracking
  - Google Analytics for usage
  - Vercel Analytics
  - Custom logging

- **Infrastructure**:
  - Uptime monitoring (UptimeRobot, Pingdom)
  - Performance monitoring (New Relic, DataDog)

### Backup and Recovery

1. **Private Keys**:
   - Store securely (hardware wallet recommended)
   - Keep encrypted backups
   - Use key management services

2. **Contract State**:
   - Regular state backups via events
   - Off-chain database for quick recovery
   - Document recovery procedures

3. **Frontend**:
   - Git repository with proper branching
   - Automated backups of deployment config
   - Documented rollback procedures

### Testing Checklist

Before production deployment:

- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] End-to-end tests on testnet
- [ ] Security audit completed
- [ ] Gas optimization verified
- [ ] Frontend cross-browser tested
- [ ] Mobile responsiveness verified
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Emergency procedures documented

### Mainnet Deployment Checklist

#### Contracts

- [ ] Testnet deployment successful
- [ ] Security audit completed
- [ ] All tests passing
- [ ] Gas costs acceptable
- [ ] Owner functions restricted
- [ ] Emergency pause implemented
- [ ] Multi-sig setup complete
- [ ] Monitoring configured
- [ ] Etherscan verification ready

#### Frontend

- [ ] Contract addresses updated
- [ ] Network configuration verified
- [ ] Environment variables set
- [ ] Error handling tested
- [ ] Loading states implemented
- [ ] Transaction confirmations working
- [ ] Mobile version tested
- [ ] Performance optimized
- [ ] Analytics configured
- [ ] Monitoring enabled

### Cost Estimation

#### Initial Deployment

- Contract deployment: ~0.1-0.5 ETH (varies by network congestion)
- Contract verification: Free (Etherscan)
- Frontend hosting: $0-50/month (depends on platform)

#### Ongoing

- Transaction fees: Varies by network and usage
- RPC endpoint: $0-200/month (depends on calls)
- Monitoring tools: $0-100/month
- Domain name: $10-20/year
- SSL certificate: Often included free (Let's Encrypt)

### Rollback Procedures

#### Contract Issues

If critical issues found:

1. Call emergency pause function (if implemented)
2. Notify users via website banner
3. Investigate and fix issue
4. Deploy new version
5. Migrate state if necessary
6. Resume operations

#### Frontend Issues

If deployment breaks:

1. Identify issue via monitoring
2. Rollback to previous version:
   ```bash
   # Vercel
   vercel rollback

   # Manual
   git revert HEAD
   git push
   ```
3. Fix issue
4. Test thoroughly
5. Redeploy

## Post-Deployment

### 1. Verify Deployment

- [ ] Contract deployed and verified on block explorer
- [ ] Frontend accessible and loading correctly
- [ ] Wallet connection working
- [ ] Contract interactions functional
- [ ] All features tested in production

### 2. Documentation

- [ ] Update README with production addresses
- [ ] Document deployment process
- [ ] Create user guide
- [ ] Update API documentation

### 3. Announce

- [ ] Social media announcement
- [ ] Blog post
- [ ] Community notification
- [ ] Documentation site updated

### 4. Monitor

- [ ] Set up alerts
- [ ] Monitor error rates
- [ ] Track usage metrics
- [ ] Review security logs
- [ ] Monitor gas costs

## Support

For deployment issues:

- Check the [Setup Guide](SETUP.md)
- Review [Troubleshooting](#troubleshooting) section
- Open a GitHub issue
- Contact the team

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Etherscan Verification Guide](https://docs.etherscan.io/)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)

---

**Remember**: Always test thoroughly on testnets before mainnet deployment!
