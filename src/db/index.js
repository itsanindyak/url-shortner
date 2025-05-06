import mongoose from "mongoose";
import Redis from "ioredis";
const connectDB = async () => {
  try {
    const connectionIntance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `MongoDB connected !! DB HOST: ${connectionIntance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error:", error);
    process.exit(1);
  }
};

const connectRedis = async () => {
  try {
    const client = new Redis(process.env.REDIS_DB_URL);
    await new Promise((resolve, reject) => {
      client.on("connect", () => {
        console.log(`Redis connected !! PORT:${process.env.REDIS_DB_PORT}`);
        resolve();
      });

      client.on("error", (error) => {
        console.error("Redis connection error:", error);
        reject(error);
      });
    });

    return client;
  } catch (error) {
    console.log("Redis connection error:", error);
    process.exit(1);
  }
};

export { connectDB, connectRedis };
