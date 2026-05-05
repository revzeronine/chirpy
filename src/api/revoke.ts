import { Request, Response } from "express";
import { getBearerToken } from "./auth.js";
import { getToken, revokeToken } from "../db/queries/refreshTokens.js";
import { UnauthorizedError } from "../error.js";

export async function handlerRevoke(request: Request, response: Response)
{
    const tokenString = getBearerToken(request);

    const refreshToken = await getToken(tokenString);

    if (refreshToken === undefined)
        throw new UnauthorizedError("Invalid token");

    revokeToken(refreshToken.token);

    response.status(204).send();
}