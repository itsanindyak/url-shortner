import { IDgen } from "../utils/IDGeneration.js";
import { Url } from "../models/url.models.js";

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
      res.status(400).json({ error: "Already used this id" });
    }
  }

  const createdUrl = await Url.create({
    shortID: id || genid,
    redirectURL,
    visitHistory: [],
  });

  return res.status(200).json(createdUrl);
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
          timestamp: Date.now(),
        },
      },
    }
  );
  if (!existingID) {
    res.status(400).json({ Error: "Not found" });
  }

  res.redirect(existingID.redirectURL);
};

const getStatistics = async (req, res) => {
  const { shortID } = req.params;

  const existingID = await Url.findOne({ shortID });
  if (!existingID) {
    res.status(200).json({ error: "ShortID not exist" });
  }

  res.status(200).json(existingID.visitHistory);
};

export { createShortUrl, redirectURL, getStatistics };
