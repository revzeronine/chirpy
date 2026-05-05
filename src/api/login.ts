import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { UnauthorizedError } from "../error.js";
import { checkPasswordHash, makeJWT } from "./auth.js";
import { User } from "../db/schema.js";
import { config } from "../config.js";

export async function handlerLogin(request: Request, response: Response)
{
    type parameters = {
        password: string;
        email: string;
        expiresInSeconds?: number;
    }

    const params: parameters = request.body;

    const user = await getUserByEmail(params.email);
    if (user === undefined)
        throw new UnauthorizedError("Incorrect email or password");

    const userId: string = user.id!;
    const expiresIn: number = params.expiresInSeconds && params.expiresInSeconds < 3600 
                              ? params.expiresInSeconds 
                              : 3600;

    const token = makeJWT(userId, expiresIn, config.api.secret);

    const isVerified: boolean = await checkPasswordHash(params.password, user.hashedPassword!);

    if (!isVerified)
        throw new UnauthorizedError("Incorrect email or password");

    const responseUser = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: token,
    };
    response.status(200).json(responseUser);
}