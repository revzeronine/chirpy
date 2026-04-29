import express from "express";

import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";

import { handlerReadiness } from "./handlers/readiness.js";
import { handlerHits, handlerResetHits } from "./handlers/hits.js";

const app = express();
const PORT = 8080;

app.get("/api/healthz", handlerReadiness);
app.get("/admin/reset", handlerResetHits);
app.get("/admin/metrics", handlerHits);

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});