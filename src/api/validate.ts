import { type Response, type Request } from "express";
import { BadRequestError } from "../error.js";

export async function handlerValidateChirp(request: Request, response: Response)
{
    type parameters = {
        body: string;
    }

    const params: parameters = request.body;

    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError(
            `Chirp is too long. Max length is ${maxChirpLength}`
        );
    }

    const filter = /(kerfuffle|sharbert|fornax)/gi;

    response.status(200).json({
        cleanedBody: params.body.replaceAll(filter, "****"),
    });
}