import express from "express";
import { redirectURL } from "../controllers/url.controllers.js";
const route = express.Router();

route.get("/g/:shortID", redirectURL);


export default route;
