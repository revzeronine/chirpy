import { type Response, type Request } from "express";

export function handlerValidateChirp(request: Request, response: Response)
{
    type parameters = {
        body: string;
    }

    type ResponseData = {
        valid?: boolean;
        error?: string;
    };

    const params: parameters = request.body;

    try {
        if (params.body.length > 140)
            throw new Error("Chirp is too long");

        const data: ResponseData = {
            valid: true,
        }
        response.set("Content-Type", "application/json");
        response.status(200).send(JSON.stringify(data));
    }
    catch (err) {
        const data: ResponseData = {
            error: err instanceof Error ? err.message : "Something went wrong",
        }

        response.set("Content-Type", "application/json");
        response.status(400).send(JSON.stringify(data));
    }
}