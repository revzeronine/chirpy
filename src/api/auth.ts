import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string>
{
    return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean>
{
    return argon2.verify(hash, password);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string
{
    const now = Date.now();

    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(now / 1000),
        exp: Math.floor(now / 1000) + expiresIn,
    }

    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string
{
    try {
        const decoded = jwt.verify(tokenString, secret);
        if (decoded.sub === undefined)
            throw new Error("Invalid token");

        return decoded.sub.toString();
    }
    catch (err) {
        throw new Error(`Could not validate token: ${err instanceof Error ? err.message : err}`);
    }
}