'use client';

import { useState } from 'react';
import { useFhevm } from './providers';
import styles from './page.module.css';

export default function Home() {
  const { client, isLoading, connect, disconnect, userAddress } = useFhevm();
  const [encryptValue, setEncryptValue] = useState('');
  const [encryptedResult, setEncryptedResult] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [contractAddress, setContractAddress] = useState('');

  const handleEncrypt = async () => {
    if (!client || !userAddress || !contractAddress) {
      alert('Please connect wallet and enter contract address');
      return;
    }

    setIsEncrypting(true);
    try {
      const value = parseInt(encryptValue);
      const encrypted = await client.encryption.encryptU32(value, {
        contract: contractAddress,
        userAddress,
      });

      setEncryptedResult(JSON.stringify(encrypted, null, 2));
    } catch (error) {
      console.error('Encryption failed:', error);
      alert('Encryption failed: ' + (error as Error).message);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>FHEVM SDK Next.js Example</h1>
        <p className={styles.description}>
          Demonstration of FHEVM SDK integrated with Next.js 14 App Router
        </p>

        <div className={styles.card}>
          <h2>Wallet Connection</h2>
          {!userAddress ? (
            <button
              onClick={connect}
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div>
              <p className={styles.connected}>
                Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </p>
              <button onClick={disconnect} className={styles.button}>
                Disconnect
              </button>
            </div>
          )}
        </div>

        {userAddress && (
          <div className={styles.card}>
            <h2>Encryption Example</h2>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Contract Address:</label>
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x..."
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Value to Encrypt (uint32):</label>
                <input
                  type="number"
                  value={encryptValue}
                  onChange={(e) => setEncryptValue(e.target.value)}
                  placeholder="Enter a number"
                  className={styles.input}
                />
              </div>
              <button
                onClick={handleEncrypt}
                disabled={isEncrypting || !encryptValue || !contractAddress}
                className={styles.button}
              >
                {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
              </button>
            </div>

            {encryptedResult && (
              <div className={styles.result}>
                <h3>Encrypted Result:</h3>
                <pre>{encryptedResult}</pre>
              </div>
            )}
          </div>
        )}

        <div className={styles.features}>
          <h2>SDK Features Demonstrated</h2>
          <ul>
            <li>✓ Client initialization with Next.js App Router</li>
            <li>✓ Wallet connection management</li>
            <li>✓ Value encryption with FHE</li>
            <li>✓ React Context for state management</li>
            <li>✓ TypeScript type safety</li>
          </ul>
        </div>

        <div className={styles.links}>
          <a href="/api-demo">API Demo →</a>
          <a href="https://github.com/zama-ai/fhevm">FHEVM Docs →</a>
        </div>
      </div>
    </main>
  );
}
