import express from "express";
import cors from "cors";
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

import urlRoute from "../src/router/url.routers.js";

app.use("/api/v1/url", urlRoute);

export { app };
