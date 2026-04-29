import { type Response, type Request } from "express";

export async function handlerValidateChirp(request: Request, response: Response)
{
    type parameters = {
        body: string;
    }

    const params: parameters = request.body;

    if (params.body.length > 140) {
        throw new Error("Chirp is too long")
    }

    const filter = /(kerfuffle|sharbert|fornax)/gi;

    response.status(200).json({
        cleanedBody: params.body.replaceAll(filter, "****"),
    });
}