import { Url } from "../models/url.models.js";
import { client } from "../index.js";

const redisToDb = async () => {
  try {
    // Use async iterator or scan instead of keys
    const keys = await client.keys("*:t");

    for (const key of keys) {
      try {
        const data = await client.lrange(key, 0, -1);
        const id = key.split(":")[0];
        const formattedData = data.map((timestamp) => ({ timestamp }));

        await Url.findOneAndUpdate(
          { shortID: id },
          {
            $addToSet: { visitHistory: { $each: formattedData } },
          },
          { runValidators: true } // Optional: run mongoose validators
        );

        await client.del(key);
      } catch (innerError) {
        console.error(`Error processing key ${key}:`, innerError);
        // Optionally log or handle individual key processing errors
      }
    }
  } catch (error) {
    console.error("Error in redisToDb:", error);
    // Consider adding more robust error handling or logging
  }
};

export { redisToDb };
