'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { BrowserProvider } from 'ethers';
import { createFhevmClient, type FhevmClient } from '@fhevm/sdk';

interface FhevmContextType {
  client: FhevmClient | null;
  isLoading: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  userAddress: string | null;
}

const FhevmContext = createContext<FhevmContextType | undefined>(undefined);

export function FhevmProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError(new Error('MetaMask not installed'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Create FHEVM client
      const fhevmClient = await createFhevmClient({
        provider,
        signer,
        network: 'sepolia',
      });

      setClient(fhevmClient);
      setUserAddress(address);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to connect:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    if (client) {
      client.dispose();
    }
    setClient(null);
    setUserAddress(null);
  };

  useEffect(() => {
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          connect();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (client) {
        client.dispose();
      }
    };
  }, []);

  return (
    <FhevmContext.Provider
      value={{
        client,
        isLoading,
        error,
        connect,
        disconnect,
        userAddress,
      }}
    >
      {children}
    </FhevmContext.Provider>
  );
}

export function useFhevm() {
  const context = useContext(FhevmContext);
  if (context === undefined) {
    throw new Error('useFhevm must be used within FhevmProvider');
  }
  return context;
}
