import { IDgen } from "../utils/IDGeneration.js";
import { Url } from "../models/url.models.js";
import {timeNow} from "../utils/date.js"
import {ApiResponce} from "../utils/ApiResponce.js"

const createShortUrl = async (req, res) => {
  const { redirectURL, id } = req.body;
  if (!redirectURL) {
    return res.status(400).json({ error: "Url is required." });
  }
  let genid, existingID;
  if (!id) {
    genid = IDgen(8);
  } else {
    existingID = await Url.findOne({ shortID: id });
    if (existingID) {
      res.status(400).json(new ApiResponce(400,existingID,"ID already taken."));
    }
  }

  const UrlID = await Url.create({
    shortID: id || genid,
    redirectURL,
    visitHistory: [],
  });

  return res.status(200).json(new ApiResponce(200,UrlID,"ShortUrl is generated successfully"));
};

const redirectURL = async (req, res) => {
  const { shortID } = req.params;
  const existingID = await Url.findOneAndUpdate(
    {
      shortID,
    },
    {
      $push: {
        visitHistory: {
          timestamp: timeNow(),
        },
      },
    }
  );
  if (!existingID) {
    res.status(400).json(new ApiResponce(400,existingID,"Invalid url request"));
  }

  res.redirect(existingID.redirectURL);
};

const getStatistics = async (req, res) => {
  const { shortID } = req.params;

  const existingID = await Url.findOne({ shortID });
  if (!existingID) {
    res.status(400).json(new ApiResponce(400,existingID,"Invalid url request"));
  }

  res.status(200).json(new ApiResponce(200,existingID.visitHistory,"Visit History fetched successfully"));
};

export { createShortUrl, redirectURL, getStatistics };

