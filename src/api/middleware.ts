import { type Response, type Request, type NextFunction } from "express";
import { config } from "../config.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../error.js";

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
    config.api.fileserverHits += 1;
    next();
}

export function middlewareError(error: Error, request: Request, response: Response, next: NextFunction): void
{
    let status = 500;
    let message = error.message;

    if (error instanceof BadRequestError) {
        status = 400;
    }
    else if (error instanceof UnauthorizedError) {
        status = 401;
    }
    else if (error instanceof ForbiddenError) {
        status = 403;
    }
    else if (error instanceof NotFoundError) {
        status = 404;
    }

    if (status >= 500) {
        message = "Internal Server Error";
        console.log(error.message);
    }

    response.status(status).json({
        error: message,
    });
}