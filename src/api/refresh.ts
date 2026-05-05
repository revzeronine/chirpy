import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "./auth.js";
import { getToken } from "../db/queries/refreshTokens.js";
import { UnauthorizedError } from "../error.js";
import { config } from "../config.js";

export async function handlerRefresh(request: Request, response: Response)
{
    const tokenString = getBearerToken(request);

    const refreshToken = await getToken(tokenString);
    const now = Date.now();
    if (refreshToken === undefined ||
        refreshToken.expiresAt.getTime() > now ||
        refreshToken.revokedAt) {
        throw new UnauthorizedError("Invalid token");
    }

    const accessToken = makeJWT(refreshToken.userId, 3600, config.api.secret);

    response.status(200).json({
        token: accessToken,
    });
}