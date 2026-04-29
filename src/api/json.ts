import { type Response } from "express";

export function respondWithJSON(response: Response, code: number, payload: any)
{
    response.set("Content-Type", "application/json");
    const data = JSON.stringify(payload);
    response.status(code).send(data);
}