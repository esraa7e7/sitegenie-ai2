import { SignJWT, jwtVerify } from 'jose';
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-key-for-development-only';
const secret = new TextEncoder().encode(JWT_SECRET);
export async function generateToken(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);
}
export async function createAccessToken(payload) {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m') // Short lived access token
        .sign(secret);
}
export async function createRefreshToken(userId) {
    return new SignJWT({ userId, type: 'refresh' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Long lived refresh token
        .sign(secret);
}
export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    }
    catch (err) {
        return null;
    }
}
