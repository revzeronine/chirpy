import { Response, Request } from "express";

import { BadRequestError, NotFoundError } from "../error.js";
import { createChirp, getChirp, getChirps } from "../db/queries/chirps.js";

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

export async function handlerGetChirps(request: Request, response: Response)
{
    const chirps = await getChirps();
    
    response.status(200).json(chirps);
}

export async function handlerGetChirp(request: Request, response: Response)
{
    const chirpId = request.params.chirpId;

    if (Array.isArray(chirpId))
        throw new BadRequestError("Invalid chirp id");

    const chirp = await getChirp(chirpId);
    
    if (chirp === undefined)
        throw new NotFoundError(`Chirp with id ${chirpId} not found`);

    response.status(200).json(chirp);
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