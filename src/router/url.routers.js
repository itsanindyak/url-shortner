import express from "express";
import { createShortUrl,redirectURL,getStatistics } from "../controllers/url.controllers.js";
const route = express.Router();

route.post("/c", createShortUrl);
route.get("/g/:shortID",redirectURL);
route.get("/stat/:shortID",getStatistics)

export default route;
