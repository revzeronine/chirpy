import { type Response, type Request } from "express";

export function handlerReadiness(request: Request, response: Response)
{
    response.set("Content-Type", "text/plain; charset=utf-8");
    response.send("OK")
}