import { Response, Request } from "express";

import { BadRequestError, NotFoundError, UnauthorizedError } from "../error.js";
import { createChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";

export async function handlerCreateChirp(request: Request, response: Response)
{
    type parameters = {
        body: string;
    }

    const token = getBearerToken(request);
    const userId = validateJWT(token, config.api.secret);

    const params: parameters = request.body;

    params.body = validateChirp(params.body);

    const chirp = await createChirp({
        body: params.body,
        userId: userId,
    });

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