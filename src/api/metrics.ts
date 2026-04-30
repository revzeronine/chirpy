import { type Response, type Request } from "express";
import { config } from "../config.js";

export async function handlerMetrics(request: Request, response: Response)
{
    response.set("Content-Type", "text/html; charset=utf-8");
    response.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`);
}

export async function handlerReset(request: Request, response: Response)
{
    config.api.fileserverHits = 0;
    response.write("Hits reset to 0");
    response.end();
}