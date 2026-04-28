import express from "express";
import { type Response, type Request } from "express";
import { middlewareLogResponses } from "./middleware.js";

function handlerReadiness(request: Request, response: Response)
{
    response.set("Content-Type", "text/plain; charset=utf-8");
    response.send("OK")
}

const app = express();
const PORT = 8080;

app.get("/healthz", handlerReadiness);

app.use(middlewareLogResponses);
app.use("/app", express.static("./src/app"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});