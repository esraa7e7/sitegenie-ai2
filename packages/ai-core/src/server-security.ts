import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * Server-Side Security Service
 * NEVER import this in frontend code
 */
export class ServerSecurity {
  private masterKey: any; // We'll let crypto handle types

  constructor(secret: string) {
    // Generate a 32-byte key from the secret
    this.masterKey = crypto.scryptSync(secret, 'sitegenie-salt', 32);
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.masterKey, iv);
    
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([iv, tag, encrypted]).toString('base64');
  }

  decrypt(cipherText: string): string {
    const data = Buffer.from(cipherText, 'base64');
    
    const iv = data.subarray(0, IV_LENGTH);
    const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const text = data.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, this.masterKey, iv);
    decipher.setAuthTag(tag);

    return decipher.update(text) + decipher.final('utf8');
  }
}
