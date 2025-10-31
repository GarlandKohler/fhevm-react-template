import { FhevmClient } from './client';
import type { FhevmConfig } from './types';

/**
 * Factory function to create and initialize FHEVM client
 * This is the main entry point for most applications
 *
 * @example
 * ```typescript
 * import { createFhevmClient } from '@fhevm/sdk';
 *
 * const client = await createFhevmClient({
 *   provider: new BrowserProvider(window.ethereum),
 *   network: 'sepolia'
 * });
 * ```
 */
export async function createFhevmClient(config: FhevmConfig): Promise<FhevmClient> {
  const client = new FhevmClient(config);
  await client.initialize();
  return client;
}

/**
 * Create a client without auto-initialization
 * Useful when you want to control initialization timing
 */
export function createFhevmClientSync(config: FhevmConfig): FhevmClient {
  return new FhevmClient(config);
}
