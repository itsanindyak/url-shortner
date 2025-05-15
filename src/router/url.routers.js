import express from "express";
import { createShortUrl,getStatistics } from "../controllers/url.controllers.js";
const route = express.Router();

route.post("/c", createShortUrl);
route.get("/stat/:shortID",getStatistics)

export default route;
