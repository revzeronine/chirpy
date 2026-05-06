import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { UnauthorizedError } from "../error.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "./auth.js";
import { config } from "../config.js";

export async function handlerLogin(request: Request, response: Response)
{
    type parameters = {
        password: string;
        email: string;
    }

    const params: parameters = request.body;

    const user = await getUserByEmail(params.email);
    if (user === undefined)
        throw new UnauthorizedError("Incorrect email or password");

    const userId: string = user.id!;
    const accessExpiresIn: number = 3600;
    const refreshExpiresIn: number = 3600 * 24 * 60;

    const accessToken = makeJWT(userId, accessExpiresIn, config.api.secret);
    const refreshToken = await makeRefreshToken(userId, refreshExpiresIn);

    const isVerified: boolean = await checkPasswordHash(params.password, user.hashedPassword!);

    if (!isVerified)
        throw new UnauthorizedError("Incorrect email or password");

    const responseUser = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: accessToken,
        refreshToken: refreshToken,
        isChirpyRed: user.isChirpyRed,
    };
    response.status(200).json(responseUser);
}