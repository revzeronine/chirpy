import { Request, Response } from "express";
import { getUserById, setUserMembership } from "../../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "../../error.js";
import { getApiKey } from "../auth.js";
import { config } from "../../config.js";

export async function handlerWebhookEvent(request: Request, response: Response)
{
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    };

    const params: parameters = request.body;

    const apiKey = getApiKey(request);
    if (apiKey !== config.api.polkaKey)
        throw new UnauthorizedError("Wrong or missing API Key");

    if (params.event === "user.upgraded") {
        const user = await getUserById(params.data.userId);
        if (user === undefined)
            throw new NotFoundError(`User with id ${params.data.userId} not found`);

        await setUserMembership(user.id!, true);
    }

    response.status(204).send();
}