import { type Response, type Request } from "express";

import { config } from "../config.js";
import { ForbiddenError } from "../error.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(request: Request, response: Response)
{
    if (config.api.platform !== "dev")
        throw new ForbiddenError("Forbidden");

    await deleteUsers();

    response.write("All users deleted");
    response.end();
}