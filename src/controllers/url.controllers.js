import { IDgen } from "../utils/IDGeneration.js";
import { Url } from "../models/url.models.js";

const createShortUrl = async (req, res) => {
  const { redirectURL } = req.body;
  if (!redirectURL) {
    return res.status(400).json({ error: "Url is required." });
  }
  const id = IDgen(8);

  await Url.create({
    shortID: id,
    redirectURL,
    visitHistory: [],
  });

  return res.status(200).json({ ID: id });
};

export { createShortUrl };
