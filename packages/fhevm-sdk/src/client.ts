import type { BrowserProvider, Signer } from 'ethers';
import type { FhevmConfig, FhevmClientState } from './types';
import { EncryptionService } from './encryption';
import { DecryptionService } from './decryption';

/**
 * Main FHEVM Client
 * Provides a unified interface for FHE operations
 */
export class FhevmClient {
  private provider: BrowserProvider | any;
  private signer?: Signer;
  private network: string;
  private gatewayUrl?: string;
  private aclAddress?: string;
  private _isInitialized: boolean = false;

  public encryption: EncryptionService;
  public decryption: DecryptionService;

  constructor(config: FhevmConfig) {
    this.provider = config.provider;
    this.signer = config.signer;
    this.network = config.network || 'localhost';
    this.gatewayUrl = config.gatewayUrl;
    this.aclAddress = config.aclAddress;

    this.encryption = new EncryptionService(this);
    this.decryption = new DecryptionService(this);
  }

  /**
   * Initialize the FHEVM client
   * Sets up encryption keys and prepares for FHE operations
   */
  async initialize(): Promise<void> {
    if (this._isInitialized) {
      return;
    }

    try {
      // Initialize FHE keys and setup
      await this.encryption.initialize();
      await this.decryption.initialize();

      this._isInitialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize FHEVM client: ${error}`);
    }
  }

  /**
   * Get current client state
   */
  getState(): FhevmClientState {
    return {
      isInitialized: this._isInitialized,
      network: this.network,
      userAddress: this.signer ? undefined : undefined, // Would need to fetch from signer
      hasKeys: this.encryption.hasKeys(),
    };
  }

  /**
   * Get provider
   */
  getProvider(): BrowserProvider | any {
    return this.provider;
  }

  /**
   * Get signer
   */
  getSigner(): Signer | undefined {
    return this.signer;
  }

  /**
   * Get network
   */
  getNetwork(): string {
    return this.network;
  }

  /**
   * Get gateway URL
   */
  getGatewayUrl(): string | undefined {
    return this.gatewayUrl;
  }

  /**
   * Get ACL address
   */
  getAclAddress(): string | undefined {
    return this.aclAddress;
  }

  /**
   * Check if initialized
   */
  isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * Dispose and cleanup resources
   */
  dispose(): void {
    this.encryption.dispose();
    this.decryption.dispose();
    this._isInitialized = false;
  }
}
