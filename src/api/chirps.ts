import { Response, Request } from "express";

import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../error.js";
import { createChirp, deleteChirp, getChirp, getChirps, getChirpsForUser } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";
import { Chirp } from "../db/schema.js";

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
    let authorId = "";
    const authorIdQuery = request.query.authorId;
    if (typeof authorIdQuery === "string")
        authorId = authorIdQuery;

    let chirps: Chirp[];

    if (authorId !== "")
        chirps = await getChirpsForUser(authorId);
    else
        chirps = await getChirps();
    
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

export async function handlerDeleteChirp(request: Request, response: Response)
{
    const chirpId = request.params.chirpId;

    if (Array.isArray(chirpId))
        throw new BadRequestError("Invalid chirp id");

    const accessToken = getBearerToken(request);
    const userId = validateJWT(accessToken, config.api.secret);

    const chirp = await getChirp(chirpId);

    if (chirp === undefined)
        throw new NotFoundError(`Chirp with id ${chirpId} does not exist`);

    if (chirp.userId !== userId)
        throw new ForbiddenError(`User with id ${userId} does not own chirp with id ${chirpId}`);


    await deleteChirp(chirpId);

    response.status(204).send();
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