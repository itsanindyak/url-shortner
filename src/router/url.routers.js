import express from "express";
import { createShortUrl } from "../controllers/url.controllers.js";
const route = express.Router();

route.post("/", createShortUrl);

export default route;
