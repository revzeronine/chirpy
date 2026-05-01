import { Response, Request } from "express";

import { BadRequestError } from "../error.js";
import { createChirp } from "../db/queries/chirps.js";

export async function handlerCreateChirp(request: Request, response: Response)
{
    type parameters = {
        body: string;
        userId: string;
    }

    const params: parameters = request.body;

    params.body = validateChirp(params.body);

    const chirp = await createChirp(params);

    if (chirp === undefined)
        throw new Error("Could not add chirp to the database.");

    response.status(201).json(chirp);
}

function validateChirp(chirpMessage: string)
{
    const maxChirpLength = 140;
    if (chirpMessage.length > maxChirpLength) {
        throw new BadRequestError(
            `Chirp is too long. Max length is ${maxChirpLength}`
        );
    };

    const filter = /(kerfuffle|sharbert|fornax)/gi;
    return chirpMessage.replaceAll(filter, "****");
}