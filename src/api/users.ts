import { Request, Response } from "express";
import { createUser, getUserByEmail, updateCredentials } from "../db/queries/users.js";
import { BadRequestError } from "../error.js";
import { User } from "../db/schema.js";
import { getBearerToken, hashPassword, validateJWT } from "./auth.js";
import { config } from "../config.js";

export async function handlerUsers(request: Request, response: Response)
{
    type parameters = {
        password: string;
        email: string;
    }

    const params: parameters = request.body;

    const hashedPassword = await hashPassword(params.password);

    const user: Omit<User, "hashedPassword"> | undefined = await createUser(
        { hashedPassword: hashedPassword, email: params.email }
    );
    if (user === undefined)
        throw new Error(`Could not create user with email ${params.email}`);

    const responseUser = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed,
    } satisfies Omit<User, "hashedPassword">;
    response.status(201).json(responseUser);
}

export async function handlerUpdateUser(request: Request, response: Response)
{
    type parameters = {
        password: string;
        email: string;
    }

    const accessToken = getBearerToken(request);
    const userId = validateJWT(accessToken, config.api.secret);

    const params: parameters = request.body;

    const hashedPassword = await hashPassword(params.password);

    const foundUser = getUserByEmail(params.email);
    if (foundUser === undefined)
        throw new BadRequestError("User does not exist");

    const user: Omit<User, "hashedPassword"> | undefined = await updateCredentials(
        userId, params.email, hashedPassword
    );
    if (user === undefined)
        throw new Error(`Could not update user with email ${params.email}`);

    const responseUser = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed,
    } satisfies Omit<User, "hashedPassword">;
    response.status(200).json(responseUser);
}