import { ethers } from 'ethers';
import type { StealthAddress, KeyPair } from '../types/ticket';

// secp256k1 curve parameters (as strings to avoid BigInt literal issues)
const GROUP_ORDER_HEX = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141';

export class StealthAddressService {
  /**
   * Generate random bytes using Web Crypto API
   */
  private static getRandomBytes(length: number): Uint8Array {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return array;
  }

  /**
   * Generate a random private key for secp256k1
   */
  private static generatePrivateKey(): string {
    let privateKey: bigint;
    const groupOrder = BigInt(GROUP_ORDER_HEX);
    do {
      const bytes = this.getRandomBytes(32);
      const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
      privateKey = BigInt('0x' + hex);
    } while (privateKey >= groupOrder || privateKey === BigInt(0));
    
    return '0x' + privateKey.toString(16).padStart(64, '0');
  }

  /**
   * Generate public key from private key using ethers.js
   * This ensures proper elliptic curve cryptography
   */
  private static getPublicKeyFromPrivate(privateKey: string): { publicKey: string; prefix: number } {
    const wallet = new ethers.Wallet(privateKey);
    const signingKey = wallet.signingKey;
    const publicKey = signingKey.publicKey;
    
    // Extract compressed public key info
    // Public key format: 0x04 + x-coordinate (32 bytes) + y-coordinate (32 bytes)
    const yCoordinate = publicKey.slice(66); // Get y-coordinate
    const yBigInt = BigInt('0x' + yCoordinate);
    const prefix = yBigInt % BigInt(2) === BigInt(0) ? 2 : 3; // Even/odd y-coordinate
    
    return {
      publicKey: publicKey.slice(4, 68), // x-coordinate only for compressed format
      prefix
    };
  }

  /**
   * Generate ephemeral key pair for stealth address generation
   */
  private static generateEphemeralKey(): KeyPair {
    const privateKey = this.generatePrivateKey();
    const { publicKey, prefix } = this.getPublicKeyFromPrivate(privateKey);
    
    return {
      privateKey,
      publicKey,
      prefix
    };
  }

  /**
   * Generate spending and viewing key pairs for stealth meta-address
   */
  public static generateStealthKeys(): {
    spendingKey: KeyPair;
    viewingKey: KeyPair;
  } {
    return {
      spendingKey: this.generateEphemeralKey(),
      viewingKey: this.generateEphemeralKey()
    };
  }

  /**
   * Compute shared secret seed for stealth address derivation
   */
  private static computeSharedSecretSeed(
    ephemeralPrivateKey: string,
    recipientPublicKey: string
  ): string {
    // In production, this would use proper ECDH
    // For demo purposes, we'll use a hash-based approach
    const combined = ephemeralPrivateKey + recipientPublicKey;
    return ethers.keccak256(ethers.toUtf8Bytes(combined));
  }

  /**
   * Derive stealth private key from recipient's spending key and shared secret
   */
  private static deriveStealthPrivateKey(
    spendingPrivateKey: string,
    sharedSecretSeed: string
  ): string {
    // Hash the shared secret to get derivation factor
    const derivationFactor = ethers.keccak256(sharedSecretSeed);
    
    // Add derivation factor to spending private key (mod group order)
    const spendingKeyBigInt = BigInt(spendingPrivateKey);
    const derivationFactorBigInt = BigInt(derivationFactor);
    const groupOrder = BigInt(GROUP_ORDER_HEX);
    
    const stealthPrivateKeyBigInt = (spendingKeyBigInt + derivationFactorBigInt) % groupOrder;
    
    return '0x' + stealthPrivateKeyBigInt.toString(16).padStart(64, '0');
  }

  /**
   * Generate stealth address using proper cryptographic derivation
   * This is a simplified version - in production you'd use full ERC-5564 compliance
   */
  public static generateStealthAddress(): StealthAddress {
    // Generate recipient's meta-address keys
    const recipientKeys = this.generateStealthKeys();
    
    // Generate ephemeral key pair for this transaction
    const ephemeralKey = this.generateEphemeralKey();
    
    // Compute shared secret and derive stealth private key
    const sharedSecretSeed = this.computeSharedSecretSeed(
      ephemeralKey.privateKey,
      recipientKeys.spendingKey.publicKey
    );
    
    const stealthPrivateKey = this.deriveStealthPrivateKey(
      recipientKeys.spendingKey.privateKey,
      sharedSecretSeed
    );
    
    const stealthWallet = new ethers.Wallet(stealthPrivateKey);
    
    return {
      address: stealthWallet.address,
      privateKey: stealthPrivateKey,
      ephemeralPublicKey: ephemeralKey.publicKey,
      ephemeralPrefix: ephemeralKey.prefix
    };
  }

  /**
   * Create wallet instance from stealth private key
   */
  static createStealthWallet(
    privateKey: string, 
    provider: ethers.Provider
  ): ethers.Wallet {
    return new ethers.Wallet(privateKey, provider);
  }

  /**
   * Wait for MJPY balance at stealth address
   */
  static async waitForMJPYBalance(
    stealthAddress: string,
    expectedAmount: bigint,
    mjpyTokenAddress: string,
    provider: ethers.Provider,
    timeoutMs: number = 60000
  ): Promise<boolean> {
    const mjpyContract = new ethers.Contract(
      mjpyTokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      provider
    );

    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const balance = await mjpyContract.balanceOf(stealthAddress);
        
        if (balance >= expectedAmount) {
          return true;
        }
        
        // Wait 2 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error checking MJPY balance:', error);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return false;
  }

  /**
   * Check if stealth address has sufficient ETH for gas
   */
  static async checkStealthGasBalance(
    stealthAddress: string,
    requiredGas: bigint,
    provider: ethers.Provider
  ): Promise<boolean> {
    try {
      const balance = await provider.getBalance(stealthAddress);
      return balance >= requiredGas;
    } catch {
      return false;
    }
  }

  /**
   * Poll for transaction confirmation
   */
  static async waitForTransaction(
    txHash: string,
    provider: ethers.Provider,
    confirmations: number = 1,
    timeoutMs: number = 60000
  ): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const receipt = await provider.getTransactionReceipt(txHash);
        if (receipt && (await receipt.confirmations()) >= confirmations) {
          return true;
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error checking transaction:', error);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return false;
  }

  /**
   * Generate stealth meta-address for a user
   * This would typically be done once and stored
   */
  static generateMetaAddress(): {
    spendingKey: KeyPair;
    viewingKey: KeyPair;
    metaAddress: string;
  } {
    const keys = this.generateStealthKeys();
    
    // Construct meta-address format: st:eth:0x<spendingPublicKey><viewingPublicKey>
    const metaAddress = `st:eth:0x${keys.spendingKey.publicKey}${keys.viewingKey.publicKey}`;
    
    return {
      ...keys,
      metaAddress
    };
  }

  /**
   * Parse meta-address to extract public keys
   */
  static parseMetaAddress(metaAddress: string): {
    spendingPublicKey: string;
    viewingPublicKey: string;
  } | null {
    const prefix = 'st:eth:0x';
    if (!metaAddress.startsWith(prefix)) {
      return null;
    }
    
    const keys = metaAddress.slice(prefix.length);
    if (keys.length !== 128) { // 64 chars each for spending and viewing keys
      return null;
    }
    
    return {
      spendingPublicKey: '0x' + keys.slice(0, 64),
      viewingPublicKey: '0x' + keys.slice(64, 128)
    };
  }

  /**
   * Validate that a string is a valid hex private key
   */
  static isValidPrivateKey(key: string): boolean {
    if (!key.startsWith('0x') || key.length !== 66) {
      return false;
    }
    
    try {
      const keyBigInt = BigInt(key);
      const groupOrder = BigInt(GROUP_ORDER_HEX);
      return keyBigInt > BigInt(0) && keyBigInt < groupOrder;
    } catch {
      return false;
    }
  }

  /**
   * Validate that a string is a valid hex public key
   */
  static isValidPublicKey(key: string): boolean {
    if (!key.startsWith('0x') || key.length !== 66) {
      return false;
    }
    
    try {
      BigInt(key);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Convert hex string to BigInt for contract interaction
   */
  static hexToBigInt(hex: string): bigint {
    return BigInt(hex);
  }

  /**
   * Format address for display
   */
  static formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}