import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../error.js";
import { User } from "../db/schema.js";
import { hashPassword } from "./auth.js";

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
    } satisfies Omit<User, "hashedPassword">;
    response.status(201).json(responseUser);
}