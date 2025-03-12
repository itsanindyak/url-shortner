import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB, connectRedis } from "./db/index.js";
import { redisToDb } from "./jobs/cleanup.js";

dotenv.config({
  path: "./.env",
});
let server;

connectDB()
  .then(() => {
    server = app.listen(process.env.PORT || 8400, () => {
      console.log(`Server is running at port${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed!!", error);
  });

export const client = await connectRedis();

process.on("SIGINT", async () => {
  console.log("SIGINT received: Starting cleanup...");
  try {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else {
          console.log("Server closed.");
          resolve();
        }
      });
    });
    console.log("Redis data saving...");
    await redisToDb();
    console.log("Saved");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    process.exit(0);
  }
});
