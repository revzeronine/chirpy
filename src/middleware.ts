import { type Response, type Request, NextFunction } from "express";
import { config } from "./config.js";

export function middlewareLogResponses(request: Request, response: Response, next: NextFunction): void
{
    response.on("finish", () => {
        if (response.statusCode !== 200) {
            console.log(`[NON-OK] ${request.method} ${request.url} - Status: ${response.statusCode}>`);
        }
    });
    next();
}

export function middlewareMetricsInc(request: Request, response: Response, next: NextFunction): void
{
    config.fileserverHits += 1;
    next();
}