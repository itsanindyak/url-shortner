import { CronJob } from "cron";
import { redisToDb } from "./cleanup.js";

export const job = new CronJob(
  "0 * * * *", // Runs at the start of every hour
  async () => {
    try {
      await redisToDb();
      console.log("redisToDb executed successfully");
    } catch (error) {
      console.error("Error executing redisToDb:", error);
    }
  },
  false // Do not start immediately
);
