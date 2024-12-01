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

process.on("SIGINT", async () => {
  console.log("SIGINT received: Starting cleanup...");
  try {
    server.close(() => {
      console.log("Server closed.");
    });

    // Perform Redis to DB operation
    await redisToDb();
    console.log("Redis data saved to database successfully.");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    process.exit(0);
  }
});

export const client = await connectRedis();
