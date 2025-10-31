/**
 * FHEVM SDK - Universal SDK for building confidential frontends
 * Framework-agnostic, works with React, Vue, Node.js, Next.js, etc.
 */

export { FhevmClient } from './client';
export { createFhevmClient } from './factory';
export { EncryptionService } from './encryption';
export { DecryptionService } from './decryption';
export { ContractHelper } from './contract';
export * from './types';
export * from './utils';

// React hooks (optional)
export { useFhevmClient, useFhevmEncrypt, useFhevmDecrypt } from './hooks';
