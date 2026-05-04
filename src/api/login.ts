import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "../error.js";
import { checkPasswordHash } from "./auth.js";
import { User } from "../db/schema.js";

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

    const isVerified: boolean = await checkPasswordHash(params.password, user.hashedPassword!);

    if (!isVerified)
        throw new UnauthorizedError("Incorrect email or password");

    const responseUser = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies Omit<User, "hashedPassword">;
    response.status(200).json(responseUser);
}