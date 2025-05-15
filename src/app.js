import express from "express";
import cors from "cors";
import { job } from "./jobs/index.js";
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
job.start();

import urlRoute from "../src/router/url.routers.js";
import redirectRoute from "../src/router/redirect.routers.js";

app.use("/api/v1/url", urlRoute);
app.use("/",redirectRoute);

export { app };
