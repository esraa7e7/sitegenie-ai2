export interface JWTPayload {
    userId: string;
    email: string;
    tenantId: string;
    role: string;
    version: number;
}
export declare function generateToken(payload: any): Promise<string>;
export declare function createAccessToken(payload: JWTPayload): Promise<string>;
export declare function createRefreshToken(userId: string): Promise<string>;
export declare function verifyToken(token: string): Promise<JWTPayload | null>;
//# sourceMappingURL=jwt.d.ts.map