import type { BrowserProvider, Signer, Contract } from 'ethers';

/**
 * Configuration for initializing the FHEVM client
 */
export interface FhevmConfig {
  provider: BrowserProvider | any;
  signer?: Signer;
  network?: 'localhost' | 'sepolia' | 'mainnet' | string;
  gatewayUrl?: string;
  aclAddress?: string;
}

/**
 * Encrypted input structure
 */
export interface EncryptedInput {
  handles: string[];
  inputProof: string;
}

/**
 * Decryption request
 */
export interface DecryptionRequest {
  contractAddress: string;
  userAddress: string;
  handle: bigint;
}

/**
 * Client state
 */
export interface FhevmClientState {
  isInitialized: boolean;
  network: string;
  userAddress?: string;
  hasKeys: boolean;
}

/**
 * Encryption options
 */
export interface EncryptOptions {
  contract: Contract | string;
  userAddress: string;
}

/**
 * Decryption result
 */
export interface DecryptionResult<T = any> {
  value: T;
  timestamp: number;
}
