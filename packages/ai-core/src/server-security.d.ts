/**
 * Server-Side Security Service
 * NEVER import this in frontend code
 */
export declare class ServerSecurity {
    private masterKey;
    constructor(secret: string);
    encrypt(text: string): string;
    decrypt(cipherText: string): string;
}
//# sourceMappingURL=server-security.d.ts.map