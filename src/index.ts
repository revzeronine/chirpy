import express from "express";

import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";

import { handlerReadiness } from "./handlers/readiness.js";
import { handlerHits, handlerResetHits } from "./handlers/hits.js";
import { handlerValidateChirp } from "./handlers/validate.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);

app.get("/admin/metrics", handlerHits);
app.post("/admin/reset", handlerResetHits);

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});