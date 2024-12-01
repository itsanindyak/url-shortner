import { Url } from "../models/url.models.js";
import { client } from "../index.js";

const redisToDb = async () => {
  const a = [];
  client.keys("*:t", (err, keys) => {
    if (err) return console.log(err);

    keys.map(async (key) => {
      let data = await client.lrange(key, 0, -1);
      let id = key.split(":")[0];
      const formattedData = data.map((timestamp) => ({ timestamp }));

      await Url.findOneAndUpdate(
        { shortID: id },
        {
          $addToSet: { visitHistory: { $each: formattedData } },
        }
      );

      await client.del(key);
    });
  });
};

export { redisToDb };
