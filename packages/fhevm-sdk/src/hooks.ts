/**
 * React hooks for FHEVM SDK
 * Optional hooks for React applications
 */

import { useState, useEffect, useCallback } from 'react';
import type { FhevmClient } from './client';
import type { FhevmConfig, EncryptedInput, EncryptOptions, DecryptionRequest } from './types';
import { createFhevmClient } from './factory';

/**
 * Hook to manage FHEVM client lifecycle
 */
export function useFhevmClient(config: FhevmConfig | null) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!config) {
      return;
    }

    let mounted = true;
    setIsLoading(true);

    createFhevmClient(config)
      .then(newClient => {
        if (mounted) {
          setClient(newClient);
          setError(null);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
      if (client) {
        client.dispose();
      }
    };
  }, [config]);

  return { client, isLoading, error };
}

/**
 * Hook for encryption operations
 */
export function useFhevmEncrypt(client: FhevmClient | null) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encryptU32 = useCallback(
    async (value: number, options: EncryptOptions): Promise<EncryptedInput | null> => {
      if (!client) {
        setError(new Error('Client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await client.encryption.encryptU32(value, options);
        return encrypted;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  const encryptU64 = useCallback(
    async (value: bigint, options: EncryptOptions): Promise<EncryptedInput | null> => {
      if (!client) {
        setError(new Error('Client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await client.encryption.encryptU64(value, options);
        return encrypted;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  const encryptBool = useCallback(
    async (value: boolean, options: EncryptOptions): Promise<EncryptedInput | null> => {
      if (!client) {
        setError(new Error('Client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await client.encryption.encryptBool(value, options);
        return encrypted;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  return {
    encryptU32,
    encryptU64,
    encryptBool,
    isEncrypting,
    error,
  };
}

/**
 * Hook for decryption operations
 */
export function useFhevmDecrypt(client: FhevmClient | null) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const userDecrypt = useCallback(
    async <T = bigint>(request: DecryptionRequest): Promise<T | null> => {
      if (!client) {
        setError(new Error('Client not initialized'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const result = await client.decryption.userDecrypt<T>(request);
        return result.value;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client]
  );

  return {
    userDecrypt,
    isDecrypting,
    error,
  };
}
