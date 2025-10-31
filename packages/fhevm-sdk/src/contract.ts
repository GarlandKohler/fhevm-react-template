import { Contract, type ContractInterface, type Signer } from 'ethers';
import type { FhevmClient } from './client';

/**
 * Contract Helper
 * Simplifies working with FHEVM contracts
 */
export class ContractHelper {
  private client: FhevmClient;

  constructor(client: FhevmClient) {
    this.client = client;
  }

  /**
   * Create a contract instance
   */
  createContract(
    address: string,
    abi: ContractInterface,
    signer?: Signer
  ): Contract {
    const signerToUse = signer || this.client.getSigner();
    if (!signerToUse) {
      throw new Error('Signer required to create contract instance');
    }
    return new Contract(address, abi, signerToUse);
  }

  /**
   * Send encrypted transaction
   */
  async sendEncryptedTransaction(
    contract: Contract,
    methodName: string,
    encryptedInputs: any,
    ...additionalArgs: any[]
  ): Promise<any> {
    try {
      const tx = await contract[methodName](
        encryptedInputs.handles[0],
        encryptedInputs.inputProof,
        ...additionalArgs
      );
      return await tx.wait();
    } catch (error) {
      throw new Error(`Failed to send encrypted transaction: ${error}`);
    }
  }

  /**
   * Call contract view function
   */
  async callView<T = any>(
    contract: Contract,
    methodName: string,
    ...args: any[]
  ): Promise<T> {
    try {
      return await contract[methodName](...args);
    } catch (error) {
      throw new Error(`Failed to call view function: ${error}`);
    }
  }
}
