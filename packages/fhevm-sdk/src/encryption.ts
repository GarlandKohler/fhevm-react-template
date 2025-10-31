import type { Contract } from 'ethers';
import type { FhevmClient } from './client';
import type { EncryptedInput, EncryptOptions } from './types';

/**
 * Encryption Service
 * Handles encryption of inputs for FHEVM contracts
 */
export class EncryptionService {
  private client: FhevmClient;
  private instance: any; // fhevmjs instance
  private initialized: boolean = false;

  constructor(client: FhevmClient) {
    this.client = client;
  }

  /**
   * Initialize encryption service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Dynamic import of fhevmjs
      const { createInstance } = await import('fhevmjs');

      const network = this.client.getNetwork();
      const chainId = this.getChainId(network);

      this.instance = await createInstance({
        chainId,
        networkUrl: this.getNetworkUrl(network),
        gatewayUrl: this.client.getGatewayUrl(),
        aclAddress: this.client.getAclAddress(),
      });

      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize encryption service: ${error}`);
    }
  }

  /**
   * Check if encryption keys are available
   */
  hasKeys(): boolean {
    return this.initialized && this.instance !== null;
  }

  /**
   * Create encrypted input for contract
   */
  async createEncryptedInput(
    contractAddress: string,
    userAddress: string
  ): Promise<any> {
    if (!this.initialized || !this.instance) {
      throw new Error('Encryption service not initialized');
    }

    return this.instance.createEncryptedInput(contractAddress, userAddress);
  }

  /**
   * Encrypt a uint8 value
   */
  async encryptU8(value: number, options: EncryptOptions): Promise<EncryptedInput> {
    const contractAddress = typeof options.contract === 'string'
      ? options.contract
      : options.contract.target as string;

    const input = await this.createEncryptedInput(contractAddress, options.userAddress);
    input.add8(value);
    return input.encrypt();
  }

  /**
   * Encrypt a uint16 value
   */
  async encryptU16(value: number, options: EncryptOptions): Promise<EncryptedInput> {
    const contractAddress = typeof options.contract === 'string'
      ? options.contract
      : options.contract.target as string;

    const input = await this.createEncryptedInput(contractAddress, options.userAddress);
    input.add16(value);
    return input.encrypt();
  }

  /**
   * Encrypt a uint32 value
   */
  async encryptU32(value: number, options: EncryptOptions): Promise<EncryptedInput> {
    const contractAddress = typeof options.contract === 'string'
      ? options.contract
      : options.contract.target as string;

    const input = await this.createEncryptedInput(contractAddress, options.userAddress);
    input.add32(value);
    return input.encrypt();
  }

  /**
   * Encrypt a uint64 value
   */
  async encryptU64(value: bigint, options: EncryptOptions): Promise<EncryptedInput> {
    const contractAddress = typeof options.contract === 'string'
      ? options.contract
      : options.contract.target as string;

    const input = await this.createEncryptedInput(contractAddress, options.userAddress);
    input.add64(value);
    return input.encrypt();
  }

  /**
   * Encrypt a boolean value
   */
  async encryptBool(value: boolean, options: EncryptOptions): Promise<EncryptedInput> {
    const contractAddress = typeof options.contract === 'string'
      ? options.contract
      : options.contract.target as string;

    const input = await this.createEncryptedInput(contractAddress, options.userAddress);
    input.addBool(value);
    return input.encrypt();
  }

  /**
   * Get FHE public key
   */
  getPublicKey(): string | undefined {
    if (!this.instance) {
      return undefined;
    }
    return this.instance.getPublicKey();
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.instance = null;
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
