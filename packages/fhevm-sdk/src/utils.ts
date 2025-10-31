/**
 * Utility functions for FHEVM SDK
 */

/**
 * Convert hex string to bytes
 */
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Convert bytes to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Format error message
 */
export function formatError(error: any): string {
  if (error.code === 4001) {
    return 'Transaction rejected by user';
  } else if (error.code === -32603) {
    return 'Internal JSON-RPC error';
  } else if (error.message) {
    return error.message;
  }
  return 'Unknown error occurred';
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  tx: any,
  confirmations: number = 1
): Promise<any> {
  return await tx.wait(confirmations);
}

/**
 * Retry async operation
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
