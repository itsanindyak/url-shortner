import { IDgen } from "../utils/IDGeneration.js";
import { Url } from "../models/url.models.js";
import { timeNow } from "../utils/date.js";
import { client } from "../index.js";
import {ApiResponce} from "../utils/ApiResponce.js"

const createShortUrl = async (req, res) => {
  const { redirectURL, id } = req.body;

  if (!redirectURL) {
    return res.status(400).json({ error: "Url is required." });
  }

  let genid = id || IDgen(8);

  try {
    if (id) {
      const existingID = await Url.findOne({ shortID: id });
      if (existingID) {
        return res
          .status(400)
          .json(new ApiResponce(400, existingID, "ID already taken."));
      }
    }

    const UrlID = await Url.create({
      shortID: genid,
      redirectURL,
      visitHistory: [],
    });

    return res
      .status(200)
      .json(new ApiResponce(200, UrlID, "ShortUrl is generated successfully"));

  } catch (err) {
    if (err.code === 11000) {
      // 11000 = duplicate key error
      return res
        .status(400)
        .json(new ApiResponce(400, {"err":"Error in mongo"}, "ID already taken."));
    }
    // other unexpected errors
    return res
      .status(500)
      .json(new ApiResponce(500, null, "Server Error"));
  }
};

const redirectURL = async (req, res) => {
  const { shortID } = req.params;

  try {
    const url = await client.get(`${shortID}:s`);
    const now = timeNow();

    if (url) {
      res.redirect(url); // Respond immediately
      client.rpush(`${shortID}:t`, timeNow()); // Log visit asynchronously
      return;
    }

    const existingID = await Url.findOneAndUpdate(
      { shortID },
      {
        $push: {
          visitHistory: {
            timestamp: now,
          },
        },
      }
    );

    if (!existingID) {
      return res.status(400).json(new ApiResponce(400,{},"Not Found"));
    }

    res.redirect(existingID.redirectURL); // Respond immediately
    await Promise.all([
      client.set(`${shortID}:s`, existingID.redirectURL, "EX", 3600),
    ]); // Update cache and log visit asynchronously
  } catch (err) {
    console.error(err);
    res.status(500).json(new ApiResponce(500,{},"Internal server error"));
  }
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

