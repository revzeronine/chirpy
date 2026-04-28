import { type Response, type Request, NextFunction } from "express";

export function middlewareLogResponses(request: Request, response: Response, next: NextFunction): void
{
    response.on("finish", () => {
        if (response.statusCode !== 200) {
            console.log(`[NON-OK] ${request.method} ${request.url} - Status: ${response.statusCode}>`);
        }
    });
    next();
}