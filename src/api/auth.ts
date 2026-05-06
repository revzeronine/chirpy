import * as argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import type { Response, Request } from "express";
import { BadRequestError, UnauthorizedError } from "../error.js";
import { createToken } from "../db/queries/refreshTokens.js";

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
    let decoded: Payload;
    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    }
    catch (err) {
        throw new UnauthorizedError(`Invalid token`);
    }

    if (decoded.sub === undefined)
        throw new UnauthorizedError("No user id in token");

    return decoded.sub;
}

export function getBearerToken(request: Request): string
{
    let auth = request.get("Authorization");

    if (auth === undefined)
        throw new UnauthorizedError("No authorization token provided");

    return auth.replace("Bearer", "").trim();
}

export async function makeRefreshToken(userId: string, expiresIn: number): Promise<string>
{
    const tokenString = crypto.randomBytes(32).toString("hex");
    const now = Date.now();

    const token = await createToken({
        token: tokenString,
        userId: userId,
        expiresAt: new Date(Math.floor(now / 1000) + expiresIn),
    });

    if (token === undefined)
        throw new Error("Could not create token");

    return tokenString;
}

export function getApiKey(request: Request)
{
    const auth = request.get("Authorization");

    if (auth === undefined)
        throw new UnauthorizedError("No authorization token provided");

    return auth.replace("ApiKey", "").trim();
}
