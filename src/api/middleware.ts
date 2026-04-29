import { type Response, type Request, type NextFunction } from "express";
import { config } from "../config.js";

export function middlewareLogResponses(request: Request, response: Response, next: NextFunction): void
{
    response.on("finish", () => {
        if (response.statusCode >= 300) {
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

export function middlewareError(error: Error, request: Request, response: Response, next: NextFunction): void
{
    console.log("Error: " + error.message);

    response.status(500).json({
        error: "Something went wrong on our end",
    });
}