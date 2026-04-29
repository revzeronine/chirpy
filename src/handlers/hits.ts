import { type Response, type Request } from "express";
import { config } from "../config.js";

export function handlerHits(request: Request, response: Response)
{
    response.send(`Hits: ${config.fileserverHits}`);
}

export function handlerResetHits(request: Request, response: Response)
{
    config.fileserverHits = 0;
    response.send();
}