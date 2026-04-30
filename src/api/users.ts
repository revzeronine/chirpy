import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../error.js";

export async function handlerUsers(request: Request, response: Response)
{
    type parameters = {
        email: string;
    }

    const params: parameters = request.body;

    const user = await createUser({ email: params.email });
    if (user === undefined)
        throw new BadRequestError(`Could not create with email ${params.email}`);

    response.status(201).json(user);
}