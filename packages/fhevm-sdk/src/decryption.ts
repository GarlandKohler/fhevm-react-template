import type { Contract } from 'ethers';
import type { FhevmClient } from './client';
import type { DecryptionRequest, DecryptionResult } from './types';

/**
 * Decryption Service
 * Handles decryption of encrypted values from FHEVM contracts
 * Supports both userDecrypt (EIP-712 signature) and publicDecrypt
 */
export class DecryptionService {
  private client: FhevmClient;
  private initialized: boolean = false;

  constructor(client: FhevmClient) {
    this.client = client;
  }

  /**
   * Initialize decryption service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
  }

  /**
   * Decrypt a value using user's private key (requires EIP-712 signature)
   *
   * @param request - Decryption request with contract address, user address, and handle
   * @returns Decrypted value
   */
  async userDecrypt<T = bigint>(request: DecryptionRequest): Promise<DecryptionResult<T>> {
    if (!this.initialized) {
      throw new Error('Decryption service not initialized');
    }

    const signer = this.client.getSigner();
    if (!signer) {
      throw new Error('Signer required for user decryption');
    }

    try {
      // Get the encryption instance
      const { createInstance } = await import('fhevmjs');
      const instance = await createInstance({
        chainId: this.getChainId(this.client.getNetwork()),
        networkUrl: this.getNetworkUrl(this.client.getNetwork()),
        gatewayUrl: this.client.getGatewayUrl(),
        aclAddress: this.client.getAclAddress(),
      });

      // Create EIP-712 signature for decryption
      const eip712 = instance.createEIP712(
        request.contractAddress,
        request.userAddress
      );

      const signature = await signer.signTypedData(
        eip712.domain,
        { Reencrypt: eip712.types.Reencrypt },
        eip712.message
      );

      // Request decryption from gateway
      const decryptedValue = await instance.reencrypt(
        request.handle,
        request.contractAddress,
        request.userAddress,
        signature
      );

      return {
        value: decryptedValue as T,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new Error(`Failed to decrypt value: ${error}`);
    }
  }

  /**
   * Decrypt a public value (no signature required)
   *
   * @param contract - Contract instance
   * @param methodName - Method name to call
   * @param args - Method arguments
   * @returns Decrypted value
   */
  async publicDecrypt<T = any>(
    contract: Contract,
    methodName: string,
    ...args: any[]
  ): Promise<DecryptionResult<T>> {
    if (!this.initialized) {
      throw new Error('Decryption service not initialized');
    }

    try {
      // Call contract method to get encrypted value
      const encryptedValue = await contract[methodName](...args);

      // For public decrypt, the value should already be decrypted by the contract
      // or be available as cleartext
      return {
        value: encryptedValue as T,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new Error(`Failed to decrypt public value: ${error}`);
    }
  }

  /**
   * Batch decrypt multiple values
   */
  async batchUserDecrypt<T = bigint>(
    requests: DecryptionRequest[]
  ): Promise<DecryptionResult<T>[]> {
    return Promise.all(
      requests.map(request => this.userDecrypt<T>(request))
    );
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.initialized = false;
  }

  private getChainId(network: string): number {
    const chainIds: Record<string, number> = {
      localhost: 31337,
      sepolia: 11155111,
      mainnet: 1,
    };
    return chainIds[network] || 31337;
  }

  private getNetworkUrl(network: string): string {
    const urls: Record<string, string> = {
      localhost: 'http://127.0.0.1:8545',
      sepolia: 'https://sepolia.infura.io/v3/',
      mainnet: 'https://mainnet.infura.io/v3/',
    };
    return urls[network] || 'http://127.0.0.1:8545';
  }
}
