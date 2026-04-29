import { type Response, type Request } from "express";
import { respondWithJSON } from "./json.js";

export function handlerValidateChirp(request: Request, response: Response)
{
    type parameters = {
        body: string;
    }

    const params: parameters = request.body;

    if (params.body.length > 140) {
        respondWithJSON(response, 400, {
            error: "Chirp is too long",
        });
        return;
    }

    respondWithJSON(response, 200, {
        valid: true,
    });
}