import express from "express";

import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { handlerValidateChirp } from "./api/validate.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());


app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});