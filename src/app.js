import express from "express";
import cors from "cors";
import { job } from "./jobs/index.js";
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
job.start();

process.on("SIGINT", redisToDb);

import urlRoute from "../src/router/url.routers.js";
import { redisToDb } from "./jobs/cleanup.js";

app.use("/api/v1/url", urlRoute);

export { app };
